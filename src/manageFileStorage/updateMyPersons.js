// update the user data base to add or remove people that the user would like on their home page
// with remove, removes from user.myPeople and also from people.onUsers
// with add, adds to user.myPeople and also adds people.onUsers
// called by <PersonDetails />, <AddPersons />, <PersonSummary />

import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

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
           }).catch(error => console.log(error))
           await updateDoc(personRef, {
               onUsers: arrayUnion(uid)
           }).catch(error => console.log(error))
        break
       }
       case "remove": {
            
              await updateDoc(userRef, {
                myPersons: arrayRemove(personInfo)
              }).catch(error => console.log(error))
              console.log('after first update in remove', uid, 'personid', personId )
           
           
              await updateDoc(personRef, {
                onUsers: arrayRemove({ uid })
              }).catch(error => console.log(error))
              console.log('after second update in remove', uid, 'personid', personId )
            
        break
       }
       default: {
           console.log('must add or remove')
       }
   }
   

    return 
    
}
export { updateMyPersons as default }
