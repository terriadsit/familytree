// a user's home page displays a snippet of each person they have chosen
// to display on their home page. The ids are in the 'users' db as 'myPersons'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
  const [peopleIds, setPeopleIds] = useState([])
  const { data } = useDocument('users', uid)
  console.log('in Home')

  const memoPeopleIds = useMemo(() => {
    let thesePeople = []
    if(data){
       thesePeople = data.myPersons.map((p) => {
       let id = p.personId
        return id
      })
    }
     return thesePeople
  }, [data]);
  
  const fetchPeople = useCallback(() => { 
    setPeopleIds(memoPeopleIds)
  }, [memoPeopleIds])

  useEffect(() => {
    fetchPeople()
    if (peopleIds) {
      getPeopleFromIds(peopleIds).then((res) => {setTempPeople(res)}).catch(error => console.log(error))
    }
  },[fetchPeople,peopleIds])

  // sort people by their birthdate
  let people = []
  let id = 0
  people = tempPeople
  people = sortPeopleByBD(people)
    
  if (error) {
    console.log('in if error', error)
    return <p className="error">${error}</p>
  }

  return (
    <div className='person-list'>
      {tempPeople && people.length > 0 && people.map((p) => {
            id++;
            return <PersonSnippet key={id} personInfo={p} />
          })
      }
            
      {error && <p className="error">${error}</p>}
        
    </div>
  )
}

export { Home as default }
