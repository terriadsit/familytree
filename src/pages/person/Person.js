import { useDocument } from '../../hooks/useDocument'
import { useParams } from 'react-router-dom'
import PersonSummary from './PersonSummary'

// styles
import './Person.css'
import PersonComments from './PersonComments'

export default function Person() {
  let params = useParams()
  const personId = params.id
  const { document, error } = useDocument('people', personId)
  
  if (error) {
    return <div className="error">{error}</div>
  }
  
  if (!document) {
    return <div className="loading">Loading...</div>
  }



  return (
    <div className="person-details">
      <PersonSummary person={document} />
      <PersonComments personId={personId}/>
    </div>
  )
}
