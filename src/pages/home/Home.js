// a user's home page displays a snippet of each person they have chosen
// to display on their home page. The ids are in the 'users' db as 'myPersons'

import { useEffect, useState } from 'react'
import PersonSnippet from './PersonSnippet'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import getPeopleFromIds from '../../manageFileStorage/getPeopleFromIds'
import sortPeopleByBD from '../../sharedFunctions/sortPeopleByBD'

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
        let id = p.personId
        return peopleIds.push(id)
       })
 
       // get entire persons details
       getPeopleFromIds(peopleIds).then((res) => {setTempPeople(res)}).catch(error => console.log(error))
    }  
  },[data])

  // sort people by their birthdate
  let people = tempPeople
  people = sortPeopleByBD(people)
    
  if (error) {
    return <p className="error">${error}</p>
  }

  return (
    <div className='person-list'>
      {people && people.map((p) => {
          return <PersonSnippet key={p.id} personInfo={p} />
        })
      }
            
      {error && <p className="error">${error}</p>}
        
    </div>
  )
}

export { Home as default }
