import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPersonFromId(id) {
  const personList = document.querySelector('.person-list')
  let person = {}
  let tempBirthday = 'unknown'
  let tempBirthCity = 'unknown'
  let tempImage = null

    try {
     const ref = doc(dbFirestore, 'people', id)

     const docSnap = await getDoc(ref)
        
      if (docSnap.exists()) {
          person = { ...docSnap.data() }
          if (person.birthDate) {
            tempBirthday = person.birthDate
          }
          if (person.birthCity) {
            tempBirthCity = person.birthCity
          }
          if (person.image) {
            tempImage = person.image
            console.log(person.image)
          }
          const newUrl = `/updateperson/${id}`
          const newHtml = `
            <a href=${newUrl}>
               <h4 >${person.name}</h4>
               <p>born in: ${tempBirthCity} </p>
               <p>birth date: ${tempBirthday}</p>
               <img src=${tempImage} alt="person image" />
            </a>
          `
          personList.innerHTML += newHtml
      } else {
          console.log('no such person')
      }
    } catch(err)  
        {console.log('could not get person ', err)}
         
   } 
  
export { getPersonFromId as default }
