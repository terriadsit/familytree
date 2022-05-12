// displays details of a person
// called by <PersonSummary > and <AddRelatives >
// receives a person with all their details
// will allow person to be added to home page of user
import { useAuthContext } from '../hooks/useAuthContext'
import ToggleSwitch from "./ToggleSwitch"
import formatNameList from "../sharedFunctions/formatNameList"
import updateMyPersons from '../manageFileStorage/updateMyPersons'
import { useDocument } from '../hooks/useDocument'

// styles
import './PersonDetails.css'

export default function PersonDetails({...person}) {
  const { user } = useAuthContext()
  const { data } = useDocument('users', user.uid)
  
  let onHome

  const checkIfOnHome  = () => {
    let found = ''
    if(data){
      found = data.myPersons.find(el => el.personId === person.id)
    }
    onHome = found ? true : false
    console.log('found',onHome)
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
    checked: onHome,
    handleToggle: (onHome) => handleToggle(onHome) 
  }

  // check if user has this person on their home page,  
  // pass props to <ToggleSwitch /> to indicate
  

  // called by <ToggleSwitch /> by props to update home page of user
  const handleToggle = (onHome) => {
    console.log('handleToggle', onHome)
    // remove or add to users list of home page persons, MyPersons
    if (onHome) {
      console.log('in add to home')
      updateMyPersons(user.uid, person.id, person.birthDate, 'add')
    } else {
      console.log('in else')
      console.log(user.uid, person.id, person.birthDate, 'remove')
      updateMyPersons(user.uid, person.id, person.birthDate, 'remove')
    }
  }

  

  return (
    <div className="person-details">
        <div className="heading">
            <h4>
              {person.name} 
              {person.otherName && <span>, ({person.otherName})</span>}
            </h4>
            <span className="toggle"><ToggleSwitch {...toggleProps} /></span>
         </div>
        <br></br>
        
        {person.imageUrl && 
          <img 
            className="image"
            src={person.imageUrl} 
            alt="person" 
        />}
                             
        <p>born: {person.birthDate ? person.birthDate : 'unknown'} to {person.deathDate ? person.deathDate : 'unknown'}</p>
        <p>at: {person.birthCity ? person.birthCity : 'unknown'}</p>
        <p>parents: {parents}</p>
        <p>sibling(s): {siblings}</p>
        <p>married to: {spouses} {person.marriageComments && spouses ? 
          `, ${person.marriageComments}` :
          person.marriageComments }
        </p>
        <p>children: {children}</p>
        {person.comments && <p>comments: {person.comments}</p>}
        <p className="created-by">Entry created by: {person.createdBy.createdByName} </p> 
    </div>
  )
}
