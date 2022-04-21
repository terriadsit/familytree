import { useEffect, useState } from "react"
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
                    <p>{comment.comment}</p>
                </li>
                
            ))}
      </ul>
    </div>
  )
}
