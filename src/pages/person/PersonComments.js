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
  const createdAt = serverTimestamp()
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  
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

  const handleSubmit = async (e) => {
      e.preventDefault()
      
      const commentToAdd = {
        personId: person.id,
        createdBy: {createdBy: user.uid, name: user.displayName },
        comment: newComment,
        createdAt,
        imageUrl,
        pdfUrl
      }

      let commentId = await addDocument(commentToAdd)
      // now add image, pdf to storage, uploadFile will update  imageUrl 
      await uploadFile('image',image, commentToAdd.personId, commentId)
      await uploadFile('pdf', pdf, commentToAdd.personId, commentId )
      console.log('pdf', pdf, commentToAdd.personId, commentId )
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
            <button className="btn">Add</button>

        </form>
    </div>
  )
}
