// displays all of the persons details and allows additional comments
// to be added calls <PersonSummary /> and <PersonComments />

import { useDocument } from '../../hooks/useDocument'
import { useParams } from 'react-router-dom'
import PersonSummary from './PersonSummary'
import PersonComments from './PersonComments'

// styles
import './Person.css'

export default function Person() {
  let params = useParams()
  const personId = params.id
  const { data, error } = useDocument('people', personId )

  if (!data) {
    return <div className="loading">Loading...</div>
  }
  if (error) {
    return <div className="error">{error}</div>
  }
  
  
  
  return (
    <div className="person-page">
      <PersonSummary  person={data}/>
      <PersonComments person={data}/>
    </div>
  )
}
