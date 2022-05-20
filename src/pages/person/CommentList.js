// comments are stored in db in their own file 
// with a field that is the person's id
// list through these
// only allow deletions by creator of the person or the creator of the comment
// loaded by <PersonComments > wh/ handles adding new comments

import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import deleteComment from "./deleteComment"
import CreatedBy from "../../components/createdBy/CreatedBy"

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
                    <br></br>
                    {comment.pdfUrl && <a href={comment.pdfUrl} alt="user added pdf" >a pdf applying to {person.name} </a>}
                    <CreatedBy props={comment.createdBy.createdBy}/>
                    <div className="comment-date">
                      <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                    </div>
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
