import { useEffect } from 'react'

import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import getPersonFromId from '../../manageFileStorage/getPersonFromId'

// styles
import './Home.css'

function Home() {
  
  const { user } = useAuthContext()
  const uid = user.uid
  const error = ''
    
  const { document } = useDocument('users', uid)
  let people = []  // people's ids

  useEffect (() => {
    // get people ids which user would like displayed
    if(document){
       document.myPersons.map((p) => {
        return people.push(p)
       })

       // sort by BirthDates
       people.sort(function(a, b) {
        const dateA = a.birthDate.toUpperCase(); // ignore upper and lowercase
        const dateB = b.birthDate.toUpperCase(); // ignore upper and lowercase
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });       
       
       // get each person's detail imformation
       for(let i = 0; i < people.length; i++) {
         getPersonFromId(people[i])
       } 
    }
  })

  if (error) {
    return <p className="error">${error}</p>
  }

  return (
    <div className='person-list'>
            
      {error && <p className="error">${error}</p>}
        
    </div>
  )
}

export { Home as default }
