import { useState  } from "react"
import { serverTimestamp } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from "../../hooks/useFirestore"
import { uploadImage } from "../../manageFileStorage/uploadImage"
import  checkImage from "../../manageFileStorage/checkImage"

export default function PersonComments(personId) {
  let tempPersonId = personId.personId
  console.log('person comments pid', tempPersonId)
  const { addDocument, response } = useFirestore('comments')
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()
  const createdAt = serverTimestamp()
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageError, setImageError] = useState(null)

  const handleImageChange = (e) => {
    setImage(null)
    setImageError(null)
    let selected = e.target.files[0]
    if (selected) {
     const error = checkImage(selected)
       if (!error) {
        setImage(selected)
        setImageUrl('')
       } else {
        setImageError(error)
       }
    }
   }

  const handleSubmit = async (e) => {
      e.preventDefault()
      
      const commentToAdd = {
        personId,
        createdBy: {createdBy: user.uid, name: user.displayName },
        comment: newComment,
        createdAt,
        imageUrl
      }

      let commentId = await addDocument(commentToAdd)

      // now add image to storage, uploadImage will update  imageUrl 
      await uploadImage(image, tempPersonId, commentId)
      
  }  
  
  return (
    <div className="comments"> 
        <h4>Comments, stories, photos, etc.</h4>
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
            {imageError && <p className='error'>{imageError}</p>}
            <button className="btn">Add</button>

        </form>
    </div>
  )
}
