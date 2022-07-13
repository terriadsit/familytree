// return a single person from the people firestore db
// parameter is persons Id in db

import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

async function getAPersonById(id) {
    let person = null
    const ref = doc(dbFirestore, 'people', id)
    const docSnap = await getDoc(ref)
       
       if (docSnap.exists()) {
         person = { id: id, ...docSnap.data() }
         return person
       } 
}

export { getAPersonById as default }