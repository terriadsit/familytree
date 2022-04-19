import { useDocument } from '../../hooks/useDocument'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PersonSummary from './PersonSummary'
import PersonComments from './PersonComments'

// styles
import './Person.css'

export default function Person() {
  let params = useParams()
  //const [personId, setPersonId] = useState(params.id)
  const personId = params.id
  const { document, error } = useDocument('people', personId)
  
  if (error) {
    return <div className="error">{error}</div>
  }
  
  if (!document) {
    return <div className="loading">Loading...</div>
  }
  

  console.log('person', personId)
  return (
    <div className="person-details">
      <PersonSummary person={document} />
      <PersonComments personId={personId}/>
    </div>
  )
}
