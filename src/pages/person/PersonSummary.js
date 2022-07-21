// displays person details along with the ability to delete or edit 
// called by <Person /> receives person from db as props 
// only the creator of the person should be able to delete or edit
// this person

import fetchComments from "../../manageFileStorage/fetchComments"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import deleteComment from "./deleteComment"
import { useFirestore } from "../../hooks/useFirestore"
import deleteStoredImage from "../../manageFileStorage/deleteStoredImage"
import updateMyPersons from "../../manageFileStorage/updateMyPersons"
import updateARelative from "../../manageFileStorage/updateARelative"
import PersonDetails from "../../components/PersonDetails"

export default function PersonSummary({...tempPerson }) {
    const person = {...tempPerson.person}
    const [error, setError] = useState('')

    const { user } = useAuthContext()
    const { deleteDocument } = useFirestore('people')
    let navigate = useNavigate()

    let personDetailsProps = {...person}
   
    //  user may edit person if they created the person
    const handleEdit = () => {
      if (person.createdBy.uid === user.uid) {
         navigate('/updateperson/' + person.id)
      } else {
         setError('only the creator of this document may edit it')
      }
    }

    // user may delete person if they created the person
    async function handleDelete(person) {
        const id = person.createdBy.uid
        if (user.uid === id ) {
          if (person.imageUrl) {
            const anError = deleteStoredImage(person.imageUrl)
            setError(anError)
            console.log('error', anError)
          }
          
          // fetch ids of comments to be deleted
          fetchComments(person.id)
            .then((commentsToDelete) => {
              // delete associated comments, if any
              for (let i = 0; i < commentsToDelete.length; i++) {
                deleteComment(commentsToDelete[i], user, person)
              }
            })
          
           
          // find those users who have this person on their home page, myPersons
          const displayedBy = person.onUsers
          displayedBy.map((uid) => (
             updateMyPersons(uid, person.id, 'remove')
          ))
          
          // remove this person from any relatives
          // update any siblings
          for (let i = 0; i < person.siblings.length; i++) {
            await updateARelative(person.siblings[i].id, person.id, person.name, person.name,'siblings', 'remove')
          }
          // update any spouses
          for (let i = 0; i < person.spouses.length; i++) {
            await updateARelative(person.spouses[i].id, person.id, person.name, person.name, 'spouses', 'remove')
          } 
          // update any parents by removing this person from children list
          for (let i = 0; i < person.parents.length; i++) {
            await updateARelative(person.parents[i].id, person.id, person.name, person.name, 'children', 'remove')
          } 
          // update any children by removing this person from the parents list
          for (let i = 0; i < person.children.length; i++) {
            await updateARelative(person.children[i].id, person.id, person.name, person.name, 'parents', 'remove')
          }

          // last, delete person
          if (!error) {
            deleteDocument(person.id)
          }
        } else {
          setError('only the creator of this person or this comment may delete it')
        }
        // redirect to home page
        navigate('/')
    }
    
  return (
    <div>
        <div className="person-summary">
          <PersonDetails {...personDetailsProps} />
          {person.createdBy.uid === user.uid && 
            <div className="edit-btns">
              <button 
                  cy-test-id="delete-button"
                  className="deleteBtn" 
                  onClick={() => handleDelete(person)}
              >
                  <i className="fa-regular fa-trash-can"></i>
                  <span className="icon-text">delete</span>
              </button>
              <button 
                  cy-test-id="edit-button"
                  className="deleteBtn" 
                  onClick={() => handleEdit(person)}
              >
                <i className="fa-solid fa-pen"></i>
                <span className="icon-text">edit</span>
              </button>
            </div>
          }
          {error && <p className="error">Error: {error}</p> }
        </div>
    </div>
  )
}
