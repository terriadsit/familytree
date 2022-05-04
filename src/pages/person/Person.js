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
  //const person = { ...tempdoc }
  
  // // prepare props
  // let personDetailsProps = {
  //   name: person.name,
  //   otherName: person.otherName,
  //   birthDate: person.birthDate,
  //   deathDate: person.deathDate,
  //   birthCity: person.birthCity, 
  //   imageUrl: person.imageUrl,
  //   comments: person.comments,
  //   spouses: person.spouses,
  //   marriageComments: person.marriageComments,
  //   siblings: person.siblings,
  //   parents: person.parents,
  //   children: person.children
  // }

  if (error) {
    return <div className="error">{error}</div>
  }
  
  if (!data) {
    return <div className="loading">Loading...</div>
  }
  
  return (
    <div className="person-page">
      <PersonSummary  person={data}/>
      <PersonComments person={data}/>
    </div>
  )
}
