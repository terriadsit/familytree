import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import { useFirestore } from "../../hooks/useFirestore"
import deleteStoredImage from "../../manageFileStorage/deleteStoredImage"

export default function CommentList({personId}) {
  const [deleteError, setDeleteError] = useState('')
  const { user } = useAuthContext()
  const query = ['personId', '==', personId]
  const { documents, error } = useCollection('comments', query, ['createdAt'])
  const { deleteDocument } = useFirestore('comments')
  
  
  if (error) {
      return <div className="error">{error}</div>
  }

  const handleClick = (comment) => {
    console.log('comment.createdBy', comment.createdBy, 'id', comment.id)
    const id = comment.createdBy.createdBy
    if (user.uid === id || id === personId.createdBy) {
      if (comment.imageUrl) {
        const anError = deleteStoredImage(comment.imageUrl)
        setDeleteError(anError)
        console.log('error', anError)
      }
      if (!deleteError) {
        deleteDocument(comment.id)
      }
    } else {
      setDeleteError('only the creator of this person or this comment may delete it')
    }
  }

  return (
    <div className="comment-list">
        <ul>
            {documents && documents.map(comment => (
                <li key={comment.id} className="comment-list-item">
                    <p className="comment-content">{comment.comment}</p>
                    
                    {comment.imageUrl && <img className="image" src={comment.imageUrl} alt="user added" />}
                    <p className="comment-author">added by: {comment.createdBy.name}</p>
                    <button className="deleteBtn" 
                      onClick={() => handleClick(comment)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                </li>
                
            ))}
      </ul>
      {deleteError && <div className="error">{deleteError}</div>}
    </div>
  )
}
