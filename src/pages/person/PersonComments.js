// add or delete comments, call <comment list />
// displayed on <Person />

import { useState } from "react"
import { serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from "../../hooks/useFirestore"
import { uploadFile } from "../../manageFileStorage/uploadFile"
import  checkFile from "../../manageFileStorage/checkFile"
import CommentList from "./CommentList"

export default function PersonComments({ person }) {
  
  const { addDocument } = useFirestore('comments')
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  

  // images will post images to firebase storage
  const handleImageChange = (e) => {
    setImage(null)
    setFileError(null)
    let selected = e.target.files[0]
    if (selected) {
     const error = checkFile('image', selected)
       if (!error) {
        setImage(selected)
        setImageUrl('')
       } else {
        setFileError(error)
       }
    }
   }

   // pdf will post to firebase storage
   const handlePdfChange = (e) => {
    setPdf(null)
    setFileError(null)
    let selected = e.target.files[0]
    if (selected) {
     const error = checkFile('pdf', selected)
       if (!error) {
        setPdf(selected)
        setPdfUrl('')
       } else {
        setFileError(error)
       }
    }
   }

   // add comment to db and clear entry form
  const handleSubmit = async (e) => {
      e.preventDefault()
      
      const commentToAdd = {
        personId: person.id,
        createdBy: {createdBy: user.uid, name: user.displayName },
        comment: newComment,
        createdAt: serverTimestamp(),
        imageUrl,
        pdfUrl
      }

      let commentId = await addDocument(commentToAdd)
      // now add image, pdf to storage, uploadFile will update  imageUrl 
      await uploadFile('image',image, commentToAdd.personId, commentId)
      await uploadFile('pdf', pdf, commentToAdd.personId, commentId )
      // clear form
      setNewComment('')
      setImageUrl(null)
      setImage(null)
      setPdf(null)
      setPdfUrl(null)
  }  
  
  return (
    <div className="comments"> 
        <h4>Comments, stories, photos, etc.</h4>
        <CommentList person={person} />
        <form className="add-comment" onSubmit={handleSubmit}>
            <label>
                <span>Add new comment:</span>
                <textarea
                    cy-test-id="comment-to-add"
                    onChange={e => setNewComment(e.target.value)}
                    value={newComment}
                    ></textarea>
            </label>
            <label>
              <span>upload an image</span>
              <input 
                type="file"
                onChange={handleImageChange}
              />
            </label>
            <label>
              <span>upload a pdf file</span>
              <input 
                type="file"
                onChange={handlePdfChange}
              />
            </label>
            {fileError && <p className='error'>{fileError}</p>}
            <button cy-test-id="add-comment-btn" className="btn">Add Comment</button>

        </form>
    </div>
  )
}
