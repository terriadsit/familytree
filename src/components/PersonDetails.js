import formatNameList from "../sharedFunctions/formatNameList"


// styles
import './PersonDetails.css'

export default function PersonDetails({...person}) {

  
  
  const parents = formatNameList(person.parents)
  const siblings = formatNameList(person.siblings)
  const spouses = formatNameList(person.spouses)
  const children = formatNameList(person.children)


  return (
    <div className="person-details">
        <h4>{person.name} 
              {person.otherName && <span> ({person.otherName})</span>}
        </h4>
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
