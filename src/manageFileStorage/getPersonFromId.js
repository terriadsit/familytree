import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPersonFromId(id) {
  const personList = document.querySelector('.persons')
  let person = {}
  let tempBirthday = 'unknown'
  let tempBirthCity = 'unknown'

    try {
     const ref = doc(dbFirestore, 'people', id)

     const docSnap = await getDoc(ref)
        
      if (docSnap.exists()) {
          person = { ...docSnap.data() }
          if (person.birthdate) {
            tempBirthday = person.birthdate
          }
          if (person.birthCity) {
            tempBirthCity = person.birthCity
          }
          const newHtml = `
            <li>
              <div className="person-list">
                <h4>${person.name}</h4>
                <p>born at: ${tempBirthCity} birth date: ${tempBirthday}</p>
              </div>
            </li>
          `
          personList.innerHTML += newHtml
      } else {
          console.log('no such person')
      }
    } catch(err)  
        {console.log('could not get person ', err)}
         
   } 
  
export { getPersonFromId as default }
