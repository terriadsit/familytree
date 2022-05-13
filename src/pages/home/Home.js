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
  
  let newPerson
  let orderedPeople = []
  
  useEffect(() => {
    // get people ids which user would like displayed
    if(data){
       data.myPersons.map((p) => {
        return peopleIds.push(p)
       })

       console.log('peopleids', peopleIds)
       
       // get entire persons details
       getPeopleFromIds(peopleIds).then((res) => {setTempPeople(res)})
    }  
    console.log('res,tempPeople',tempPeople[0]) 
  },[data])

  console.log('people array', tempPeople, orderedPeople)
  
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
  
  console.log('sorted people',people)
  

  if (error) {
    return <p className="error">${error}</p>
  }

  return (
    <div className='person-list'>
      {people && people.map((p) => (
        <PersonSnippet personInfo={p} />
       ))
      }
            
      {error && <p className="error">${error}</p>}
        
    </div>
  )
}

export { Home as default }
