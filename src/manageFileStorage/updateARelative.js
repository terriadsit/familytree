// manage updates to relative arrays that each person in people db has
// may remove or add a relative or change the name of a present relative
// called by <AddRelatives /> and <PersonSummary />

import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

async function updateARelative(personToUpdateId, relativeId, relativeName, newName, whRelative, whChange) {
    const userRef = doc(dbFirestore, 'people', personToUpdateId)
    const originalPersonInfo = { 
        id: relativeId,
        name: relativeName
    }
    const newPersonInfo = { 
        id: relativeId,
        name: newName
    }
    console.log('in update a rel', personToUpdateId, relativeId, relativeName, newName, whRelative, whChange )
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                [whRelative]: arrayUnion(originalPersonInfo)
           }).catch(err => console.log('error 1 updating relative', err))
        break
       }
       case "remove": {
           await updateDoc(userRef, {
               [whRelative]: arrayRemove(originalPersonInfo)
           }).catch(err => console.log('error 2 updating relative', err))
        break
       }
       case "changeName": {
        console.log('in case changeName')
        await updateDoc(userRef, {
            [whRelative]: arrayRemove(originalPersonInfo)
        }).catch(err => console.log('error 3 updating relative', err))
        console.log('before remove', newPersonInfo)
        await updateDoc(userRef, {
            [whRelative]: arrayUnion(newPersonInfo)
        }).catch(err => console.log('error 4 updating relative', err))
       break
       }
       default: {
           console.log('must add, remove or changeName')
       }
   }
   
    return 
    
}
export { updateARelative as default }
