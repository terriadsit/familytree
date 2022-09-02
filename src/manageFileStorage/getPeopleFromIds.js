 
// Called by <Home /> to retrieve a person's details from the 'people' db.
// Receives a list of person id's.
// Returns their full information so they may have snippets displayed
// on a users homepage.

import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPeopleFromIds(personIds) {
  
  let person = null
  
  // go through each id and retrieve the promise of data
  const promises = personIds.map(async id => {
    
    const ref = doc(dbFirestore, 'people', id)
    const docSnap = await getDoc(ref)
       
       if (docSnap.exists()) {
         person = { id: id, ...docSnap.data() }
         return person
       }  
  })
  // once all the promises are fullfilled, return people
  const people = await Promise.all(promises)
  return people
}
  
export { getPeopleFromIds as default }