import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

async function updateARelative(personToUpdateId, relativeId, relativeName, whRelative, whChange) {
    const userRef = doc(dbFirestore, 'people', personToUpdateId)
    const personInfo = { 
        id: relativeId,
        name: relativeName
    }
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                [whRelative]: arrayUnion(personInfo)
           })
        break
       }
       case "remove": {
           await updateDoc(userRef, {
               [whRelative]: arrayRemove(personInfo)
           })
        break
       }
       default: {
           console.log('must add or remove')
       }
   }
   
    return 
    
}
export { updateARelative as default }
