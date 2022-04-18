import { useDocument } from '../../hooks/useDocument'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'

// styles 
import './UpdatePerson.css'

export default function UpdatePerson() {
  let params = useParams()
  const personId = params.id
  console.log(personId)
  const { document, error } = useDocument('people', personId)
  console.log(document)
    
  return (
    <div>
        UpdatePerson
    </div>
  )
}
