import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

async function updateMyPersons(uid, personId, birthDate, whChange) {
    const userRef = doc(dbFirestore, 'users', uid)
    birthDate = birthDate ? birthDate : 'unknown' 
    const personInfo = { 
        personId,
        birthDate
    }
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
