// take in the creator (a name and uid db) of a comment or person. Display email
// in a tool tip or display "email not shared"
// called by <PersonDetails /> and <CommentList >
import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'

// styles
import './CreatedBy.css'

export default function CreatedBy({...props}) {
  // state for showing tooltip "creator email"
  const [isShown, setIsShown] = useState(false)
  
  // get creator of this entry's details
  const uid = props.props
    
  const { data, error } = useDocument('users', uid)
  const creator = {...data}
  
  // does this user share their email address?
  const emailMessage = creator.shareEmail ? creator.email : 'This user has a private email'
 
  if (error) {
      console.log('error fetching creator', error)
      return null
  }
  return (
    <div className='creator'>
      <p 
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        entry created by: {creator.displayName}
      </p>
    
      {isShown && <p className='tip'>{emailMessage}</p>}
    </div>
  )
}
