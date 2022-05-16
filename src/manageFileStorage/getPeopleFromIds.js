 
// called by <Home /> 
import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPeopleFromIds(personIds) {
  
  let person = null
  
  console.log('personIds in getPerson', personIds)
  
    const promises = personIds.map(async id => {
      console.log('id in map', id)
      //debugger;
      const ref = doc(dbFirestore, 'people', id.personId)
      console.log('ref', ref)
      const docSnap = await getDoc(ref)
         
       if (docSnap.exists()) {
         person = { id: id.personId, ...docSnap.data() }
         console.log('person in docsnap', person)
         return person
       }  
    })
    const people = await Promise.all(promises)
    console.log('getbyid',people)
    return people
}
  
export { getPeopleFromIds as default }