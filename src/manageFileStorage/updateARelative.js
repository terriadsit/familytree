// manage updates to relative arrays that each person in people db has
// may remove or add a relative or change the name of a present relative
// called by <AddRelatives /> and <PersonSummary />

import { dbFirestore } from "../firebase/config"
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import myLogger from '../sharedFunctions/myLogger'

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
    switch(whChange) {
       case "add": {
           await updateDoc(userRef, {
                [whRelative]: arrayUnion(originalPersonInfo)
           }).catch(err => myLogger(`error 1 updating relative, ${err}`))
        break
       }
       case "remove": {
           await updateDoc(userRef, {
               [whRelative]: arrayRemove(originalPersonInfo)
           }).catch(err => myLogger(`error 2 updating relative, ${err}`))
        break
       }
       case "changeName": {
        await updateDoc(userRef, {
            [whRelative]: arrayRemove(originalPersonInfo)
        }).catch(err => myLogger(`error 3 updating relative, ${err}`))
        await updateDoc(userRef, {
            [whRelative]: arrayUnion(newPersonInfo)
        }).catch(err => myLogger(`error 4 updating relative, ${err}`))
       break
       }
       default: {
           myLogger('must add, remove or changeName')
       }
   }
   
    return 
    
}
export { updateARelative as default }
