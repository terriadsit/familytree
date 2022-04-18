import { useDocument } from '../../hooks/useDocument'
import { useParams } from 'react-router-dom'

// styles 
import './UpdatePerson.css'

export default function UpdatePerson() {
  let params = useParams()
  const personId = params.id
  console.log(personId)
  const { document, error } = useDocument('people', personId)
  
  if (error) {
    return <div className="error">{error}</div>
  }
  
  if (!document) {
    return <div className="loading">Loading...</div>
  }



  return (
    <div className="person-details">
      <h1>{document.name}</h1>
        
    </div>
  )
}
