// update the user data base to add or remove people that the user would like on their home page
// with remove, removes from user.myPeople and also from people.onUsers
// with add, adds to user.myPeople and also adds people.onUsers
// called by <PersonDetails />, <AddPersons />, <PersonSummary />

import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import myLogger from '../sharedFunctions/myLogger'

async function updateMyPersons(uid, personId, whChange) {
    const userRef = doc(dbFirestore, 'users', uid)
   
    const personInfo = { 
        personId
    }

    const personRef = doc(dbFirestore, 'people', personId) 
    
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                myPersons: arrayUnion(personInfo)
           }).catch(error => myLogger(`updateMyPersons error on add, arrayUnion 1: ${error}`))
           await updateDoc(personRef, {
               onUsers: arrayUnion(uid)
           }).catch(error => myLogger(`updateMyPersons error on add, arrayUnion 2: ${error}`))
        break
       }
       case "remove": {
          await updateDoc(userRef, {
            myPersons: arrayRemove(personInfo)
          }).catch(error => myLogger(`updateMyPersons error on remove, arrayRemove 1: ${error}`))
             
          await updateDoc(personRef, {
                onUsers: arrayRemove({ uid })
          }).catch(error => myLogger(`updateMyPersons error on remove, arrayRemove 2: ${error}`))
       break
       }
       default: {
           myLogger('must add or remove')
       }
   }
   
   return 
    
}
export { updateMyPersons as default }
