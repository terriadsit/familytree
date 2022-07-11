// return a bit of html for each person on the <Home /> page

import { NavLink } from "react-router-dom"

// styles
import './Home.css'

export default function PersonSnippet({...personInfo}) {
 
  const person = { ...personInfo.personInfo }
  let id = person.id
  const newUrl = `/person/${id}`
  
  // let the user know if birthdate and city are unknown, don't try to display a null Imageurl
  const tempBirthDate = person.birthDate ? person.birthDate : 'unknown'
  const tempBirthCity = person.birthCity ? person.birthCity : 'unknown'

  return (
    <div className="person-list" cy-test-id={person.id}>
      <NavLink to={newUrl} >
        <h4>{person.name}</h4>
        <p>born in: {tempBirthCity} </p>
        <p>birth date: {tempBirthDate}</p>
        {person.imageUrl && <img src={person.imageUrl} alt="this person" />}
      </NavLink>
    </div>
  )
}
