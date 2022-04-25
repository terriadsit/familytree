import { useState } from "react"
import { dbFirestore } from "../../firebase/config"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
//import { useCollection } from "../../hooks/useCollection"
import deleteComment from "./deleteComment"
import { useFirestore } from "../../hooks/useFirestore"
import deleteStoredImage from "../../manageFileStorage/deleteStoredImage"
import { query, collection, where, getDocs } from 'firebase/firestore'
import updateMyPersons from "../../manageFileStorage/updateMyPersons"
import updateARelative from "../../manageFileStorage/updateARelative"

export default function PersonSummary({ person }) {
    const [deleteError, setDeleteError] = useState('')
    let commentsToDelete = []
    const { user } = useAuthContext()
    const { deleteDocument } = useFirestore('people')
    let navigate = useNavigate()

   
    const formatNameList = (list) => {
        let tempList = ''
        for (let i=0; i < list.length; i++) {
            tempList += list[i].name + ', '
        }
        tempList = tempList.replace(/,\s*$/,"")
        return tempList
    }
    const parents = formatNameList(person.parents)
    const siblings = formatNameList(person.siblings)
    const spouses = formatNameList(person.spouses)
    const children = formatNameList(person.children)

    // delete person
    async function handleClick(person) {
        const id = person.createdBy.uid
        if (user.uid === id ) {
          if (person.imageUrl) {
            const anError = deleteStoredImage(person.imageUrl)
            setDeleteError(anError)
            console.log('error', anError)
          }
          
          // fetch ids of comments to be deleted
          let ref = collection(dbFirestore, 'comments')
          let q = query(ref, where('personId', '==', person.id))  
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach(doc => { 
             commentsToDelete.push({ commentId: doc.id, commentData: doc.data()})
          })
         // delete associated comments, if any
          for (let i = 0; i < commentsToDelete.length; i++) {
             deleteComment(commentsToDelete[i], user, person)
           }
           
           // find those users who have this person on their home page, myPersons
           const displayedBy = person.onUsers
           displayedBy.map((uid) => (
             updateMyPersons(uid, person.id, person.birthDate, 'remove')
           ))
          
          // remove this person from any relatives
          // update any siblings
          for (let i = 0; i < person.siblings.length; i++) {
            updateARelative(person.siblings[i].id, person.id, person.name, 'siblings', 'remove')
          }
          // update any spouses
          for (let i = 0; i < person.spouses.length; i++) {
            updateARelative(person.spouses[i].id, person.id, person.name, 'spouses', 'remove')
          } 
          // update any parents by removing this person from children list
          for (let i = 0; i < person.parents.length; i++) {
            updateARelative(person.parents[i].id, person.id, person.name, 'children', 'remove')
          } 
          // update any children by removing this person from the parents list
          for (let i = 0; i < person.children.length; i++) {
            updateARelative(person.children[i].id, person.id, person.name, 'parents', 'remove')
          }

          // last, delete person
          if (!deleteError) {
            deleteDocument(person.id)
          }
        } else {
          setDeleteError('only the creator of this person or this comment may delete it')
        }
        // redirect to home page
        navigate('/')
      }
    
  return (
    <div>
        <div className="person-summary">
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
            <p>married to: {spouses} {person.marriageComments}</p>
            <p>children: {children}</p>
            <div>{person.comments}</div>
            <p className="created-by">Entry created by: {person.createdBy.createdByName} </p>
            <button className="deleteBtn" 
              onClick={() => handleClick(person)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
            {deleteError && <p className="error">Error deleting document: {deleteError}</p> }
        </div>
    </div>
  )
}
