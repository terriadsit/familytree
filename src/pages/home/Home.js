// a user's home page displays a snippet of each person they have chosen
// to display on their home page. The ids are in the 'users' db as 'myPersons'

import { useEffect, useState } from 'react'
import PersonSnippet from './PersonSnippet'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import getPeopleFromIds from '../../manageFileStorage/getPeopleFromIds'

// styles
import './Home.css'

function Home() {
  
  const { user } = useAuthContext()
  const uid = user.uid
  const error = ''
  const [tempPeople, setTempPeople] = useState([]) 
  const { data } = useDocument('users', uid)
  let peopleIds = []  // people's ids
  
  useEffect(() => {
    // get people ids which user would like displayed
    if(data){
       data.myPersons.map((p) => {
        return peopleIds.push(p)
       })
 
       // get entire persons details
       getPeopleFromIds(peopleIds).then((res) => {setTempPeople(res)})
    }  
  },[data])

  // sort people by their birthdate
  const people = tempPeople
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
  }) 
  
  if (error) {
    return <p className="error">${error}</p>
  }

  return (
    <div className='person-list'>
      {people && people.map((p) => (
        <PersonSnippet key={p.id} personInfo={p} />
       ))
      }
            
      {error && <p className="error">${error}</p>}
        
    </div>
  )
}

export { Home as default }
