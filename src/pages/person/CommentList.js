import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import deleteComment from "./deleteComment"

export default function CommentList({ person }) {
  const [deleteError, setDeleteError] = useState('')
  const { user } = useAuthContext()
  const query = ['personId', '==', person.id]
  const { documents, error } = useCollection('comments', query, ['createdAt'])
    
  if (error) {
      setDeleteError(error)
      return <div className="error">{error}</div>
  }

  const handleClick = (comment) => {
    const error = deleteComment(comment, user, person)
    console.log(error)
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
                      onClick={() => handleClick({commentId: comment.id, commentData: comment})}
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
