import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPersonFromId(id) {
    let person = {}
    const personList = document.querySelector('.persons')
    const node = document.createElement("li")

    try {
     const ref = doc(dbFirestore, 'people', id)

     const docSnap = await getDoc(ref)

      if (docSnap.exists()) {
         console.log('document data', docSnap.data().name)
          person = { ...docSnap.data() }
          console.log('in try block', person)
          const textnode = document.createTextNode(`${person.name}`)
          node.appendChild(textnode)
          personList.appendChild(node)
      } else {
          console.log('no such document')
      }
    } catch(err)  
        {console.log('could not get person ', err)}
         
   } 
   

export { getPersonFromId as default }
