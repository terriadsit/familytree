import { useCollection } from "../../hooks/useCollection"

export default function CommentList({personId}) {
  const query = ['personId', '==', personId]
  const { documents, error } = useCollection('comments', query, ['createdAt'])
  
  if (error) {
      return <div className="error">{error}</div>
  }

  return (
    <div className="comment-list">
        <ul>
            {documents && documents.map(comment => (
                <li key={comment.id} className="comment-list-item">
                    <p className="comment-content">{comment.comment}</p>
                    
                    {comment.imageUrl && <img className="image" src={comment.imageUrl} alt="user added" />}
                    <p className="comment-author">added by: {comment.createdBy.name}</p>
                    <i className="fa-regular fa-trash-can"></i>
                </li>
                
            ))}
      </ul>
    </div>
  )
}
