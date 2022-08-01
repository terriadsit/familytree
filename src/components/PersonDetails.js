// displays details of a person
// called by <PersonSummary /> and <AddRelatives />
// receives a person with all their details as props
// will allow person to be added to home page of user
// do not display person.comments or relatives if on /addrelatives pages

import { useDocument } from '../hooks/useDocument'
import { useAuthContext } from '../hooks/useAuthContext'
import ToggleSwitch from "./ToggleSwitch"
import formatNameList from "../sharedFunctions/formatNameList"
import updateMyPersons from '../manageFileStorage/updateMyPersons'
import CreatedBy from './createdBy/CreatedBy'
import { useLocation } from 'react-router-dom'

// styles
import './PersonDetails.css'

export default function PersonDetails({...person}) {
  const { user } = useAuthContext()
  const { data } = useDocument('users', user.uid)
  const location = useLocation()
  console.log('in personDetails')
  // don't display person.comments or relatives on /addrelatives
  const onAdd = location.pathname.includes('add')
    
  let onHome 

  const checkIfOnHome  = () => {
    let found = ''
    if(data){
      found = data.myPersons.find(el => el.personId === person.id)
    }
    onHome = found ? true : false
  }
  
  checkIfOnHome()
 
  // put commas in between names
  const parents = formatNameList(person.parents)
  const siblings = formatNameList(person.siblings)
  const spouses = formatNameList(person.spouses)
  const children = formatNameList(person.children)
  
  // allow user to be added to home page
  const toggleProps = {
    label: '',
    onHome: onHome,
    handleToggle: (onHome) => handleToggle(onHome) 
  }

  // check if user has this person on their home page,  
  // pass props to <ToggleSwitch /> to indicate
  

  // called by <ToggleSwitch /> by props to update home page of user
  const handleToggle = (onHome) => {
    // remove or add to users list of home page persons, MyPersons
    if (onHome) {
      updateMyPersons(user.uid, person.id,  'add')
    } else {
      updateMyPersons(user.uid, person.id,  'remove')
    }
  }

  return (
    <div className="person-details">
          <div>
            <h3 cy-test-id="person-name">
              {person.name} 
              {person.otherName && <span> ({person.otherName})</span>}
            </h3>
          </div>
        <br></br>
        
        {person.imageUrl && 
          <img 
            className="image"
            src={person.imageUrl} 
            alt="person" 
        />}
                             
        <p cy-test-id="born"><b>born: </b>{person.birthDate ? person.birthDate : 'unknown'} to {person.deathDate ? person.deathDate : 'unknown'}</p>
        <p cy-test-id="birth-city"><b>at: </b>{person.birthCity ? person.birthCity : 'unknown'}</p>
        {!onAdd && <p cy-test-id="parents"><b>parents: </b>{parents}</p>}
        {!onAdd && <p cy-test-id="siblings"><b>sibling(s): </b>{siblings}</p>}
        {!onAdd && <p cy-test-id="spouse"><b>married to: </b>{spouses}{person.marriageComments && spouses ? 
          `, ${person.marriageComments}` :
          person.marriageComments }
        </p>}
        {!onAdd && <p cy-test-id="children"><b>children: </b>{children}</p>}
        {(!onAdd && person.comments) && <p cy-test-id="comments"><b>comments: </b>{person.comments}</p>}
        <CreatedBy props={person.createdBy.uid} /> 
        <span className="toggle"><ToggleSwitch {...toggleProps} /></span>
        
    </div>
  )
}
