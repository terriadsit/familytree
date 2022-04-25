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
        console.log('person.createdBy', person.createdBy, 'id', person.id)
        const id = person.createdBy.uid
        if (user.uid === id ) {
            console.log('in first if', user.uid, id)
          if (person.imageUrl) {
            const anError = deleteStoredImage(person.imageUrl)
            setDeleteError(anError)
            console.log('error', anError)
          }
          
          // fetch ids of comments to be deleted
          let ref = collection(dbFirestore, 'comments')
          let q = query(ref, where('personId', '==', person.id))  
          const querySnapshot = await getDocs(q)
          console.log('in catch ids', querySnapshot)
          querySnapshot.forEach(doc => { 
             commentsToDelete.push({ commentId: doc.id, commentData: doc.data()})
          })
         // delete associated comments, if any
          for (let i = 0; i < commentsToDelete.length; i++) {
             deleteComment(commentsToDelete[i], user, person)
           }
           
           // find those users who have this person on their home page, myPersons
           const displayedBy = person.onUsers
           console.log('person.onUsers', displayedBy)
           displayedBy.map((uid) => {
             updateMyPersons(uid, person.id, null, 'remove')
           })
                    
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
