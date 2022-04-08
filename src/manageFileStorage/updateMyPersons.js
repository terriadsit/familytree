import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

async function updateMyPersons(uid, person, whChange) {
    const userRef = doc(dbFirestore, 'users', uid)
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                myPersons: arrayUnion(person)
           })
        break
       }
       case "remove": {
           await updateDoc(userRef, {
               myPersons: arrayRemove(person)
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
