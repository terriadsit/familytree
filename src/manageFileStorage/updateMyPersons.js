// update the user data base to add or remove people that the user would like on their home page

import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

async function updateMyPersons(uid, personId, whChange) {
    const userRef = doc(dbFirestore, 'users', uid)
     
    const personInfo = { 
        personId
    }
    console.log('update my person',personInfo)
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                myPersons: arrayUnion(personInfo)
           })
        break
       }
       case "remove": {
           await updateDoc(userRef, {
               myPersons: arrayRemove(personInfo)
           })
        break
       }
       default: {
           console.log('must add or remove')
       }
   }
   

    return 
    
}
export { updateMyPersons as default }
