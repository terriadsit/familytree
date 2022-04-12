import { dbFirestore } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

// get a persons detail imformation from their id
async function getPersonFromId(id) {
  const personList = document.querySelector('.person-list')
  let person = {}
  let tempBirthday = 'unknown'
  let tempBirthCity = 'unknown'
  let tempImageUrl = null

    try {
     const ref = doc(dbFirestore, 'people', id)

     const docSnap = await getDoc(ref)
        
      if (docSnap.exists()) {
          person = { ...docSnap.data() }
          console.log('get person person', person)
          if (person.birthDate) {
            tempBirthday = person.birthDate
          }
          if (person.birthCity) {
            tempBirthCity = person.birthCity
          }
          if (person.imageUrl) {
            tempImageUrl = person.imageUrl
            console.log('get person from id',person.imageUrl)
          }
          const newUrl = `/updateperson/${id}`
          let newHtml = `
            <a href=${newUrl}>
               <h4 >${person.name}</h4>
               <p>born in: ${tempBirthCity} </p>
               <p>birth date: ${tempBirthday}</p>
              `
          newHtml += (!tempImageUrl ? "</a>" : 
                      `<img 
                        src=${tempImageUrl} 
                        alt="person image" 
                        class-name="image"
                        />
                    </a>`
          )
          personList.innerHTML += newHtml
          
      } else {
          console.log('no such person')
      }
    } catch(err)  
        {console.log('could not get person ', err)}
         
   } 
  
export { getPersonFromId as default }
