// comments are stored in db in their own file 
// with a field that contains the person's id who the comment applies to
// as well as the creator's uid as a field 
// list through these
// only allow deletions by creator of the person or the creator of the comment
// loaded by <PersonComments > wh/ handles adding new comments
// calls <createcBy />

import { useCollection } from "../../hooks/useCollection"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import deleteComment from "./deleteComment"
import CreatedBy from "../../components/createdBy/CreatedBy"
import myLogger from "../../sharedFunctions/myLogger"

export default function  CommentList({ person }) {
  const [deleteError, setDeleteError] = useState('')
  const { user } = useAuthContext()
  const query = ['personId', '==', person.id]
  const { documents, error } = useCollection('comments', query, ['createdAt'])
    
  if (error) {
      setDeleteError(error)
      return <div className="error">{error}</div>
  }

  // delete a comment if user is the creator of this person or creator of the comment
  const handleClick = (comment) => {
    const error = deleteComment(comment, user, person)
    myLogger(error)
  }

  return (
    <div className="comment-list">
        <ul>
            {documents && documents.map(comment => (
                <li key={comment.id} className="comment-list-item">
                    <p cy-test-id="comment-content" className="comment-content">{comment.comment}</p>
                    
                    {comment.imageUrl && <img className="image" src={comment.imageUrl} alt="user added" />}
                    <br></br>
                    {comment.pdfUrl && <a href={comment.pdfUrl} target="_blank" rel="noreferrer" alt="user added pdf" >a pdf for {person.name} </a>}
                    
                    <CreatedBy props={comment.createdBy.createdBy}/>
                    {comment.createdAt &&
                      <div className="comment-date">
                        <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                      </div>
                    }
                    
                    {(user.uid === person.createdBy.uid ||
                     comment.createdBy.createdBy === user.uid) &&
                       <button className="deleteBtn" 
                        onClick={() => handleClick({commentId: comment.id, commentData: comment})}
                       >
                         <i className="fa-regular fa-trash-can"> delete</i>
                       </button>
                      
                    }
                </li>
                
            ))}
      </ul>
      {deleteError && <div className="error">{deleteError}</div>}
    </div>
  )
}
