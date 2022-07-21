// add or delete comments, call <comment list />
// displayed on <Person />

import { useState } from "react"
import { serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from "../../hooks/useFirestore"
import { uploadFile } from "../../manageFileStorage/uploadFile"
import  checkFile from "../../manageFileStorage/checkFile"
import CommentList from "./CommentList"
import compressImage from "../../manageFileStorage/compressImage"

export default function PersonComments({ person }) {
  
  const { addDocument } = useFirestore('comments')
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [pdfError, setPdfError] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [inputKey, setInputKey] = useState('')
  const [pdfInputKey, setPdfInputKey] = useState('')
  
  // to clear out the input field for image file upload
  const resetsFileInput = () => {
    let randomString = Math.random().toString(36);
    setInputKey(randomString)
  }

  // to clear out the input field for pdf file upload
  const resetsPdfFileInput = () => {
    let randomString = Math.random().toString(36);
    setPdfInputKey(randomString)
  }
  
  // images will post images to firebase storage
  const handleImageChange = (e) => {
    setImage(null)
    setFileError(null)
    setPdfError(null)
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

   function tooLargeError()  {
    setFileError('the image is too large, see FAQ for more information')
   }

   // pdf will post to firebase storage
   const handlePdfChange = (e) => {
    setPdf(null)
    setFileError(null)
    setPdfError(null)
    let selected = e.target.files[0]
    if (selected) {
     const error = checkFile('pdf', selected)
       if (!error) {
        setPdf(selected)
        setPdfUrl('')
       } else {
        setPdfError(error)
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
      // compressImage calls uploadFile wh/ updates imageUrl
      if (image) {
        compressImage(image, commentToAdd.personId, commentId, tooLargeError)
      }

      if (pdf) {
        await uploadFile('pdf', pdf, commentToAdd.personId, commentId )
      }
        // clear form
      setNewComment('')
      setImageUrl(null)
      setImage(null)
      setPdf(null)
      setPdfUrl(null)
      resetsFileInput()
      resetsPdfFileInput()
      setFileError(null)
      setPdfError(null)
  }  
  
  return (
    
    <div className="comments"> 
        <h4>Comments, stories, photos, etc.</h4>
        <CommentList person={person} />
        <form className="add-comment" onSubmit={handleSubmit}>
            <label>
                <span>new comment:</span>
                <textarea
                    cy-test-id="comment-to-add"
                    onChange={e => setNewComment(e.target.value)}
                    value={newComment}
                    ></textarea>
            </label>
            <label>
              <span>upload an image</span>
              <input 
                key={inputKey || '' }
                cy-test-id="image-file"
                type="file"
                onChange={handleImageChange}
              />
            </label>
            <label>
              <span>upload a pdf file</span>
              <input 
                key={pdfInputKey || '' }
                cy-test-id="pdf-file"
                type="file"
                onChange={handlePdfChange}
              />
            </label>
            {(fileError || pdfError) && <p className='error'>{fileError} {pdfError}</p>}
            {(!fileError && !pdfError) && <button cy-test-id="add-comment-btn" className="btn">Add Comment</button>}

        </form>
    </div>
  )
}
