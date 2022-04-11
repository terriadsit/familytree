import { useEffect } from 'react'

import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'
import getPersonFromId from '../../manageFileStorage/getPersonFromId'

import PersonList from './PersonList'

// styles
import './Home.css'


function Home() {
  
  const { user } = useAuthContext()
  const uid = user.uid
  console.log('uid',uid)
  const error = ''
  
  
  const { document } = useDocument('users', uid)
  let people = []  // people's ids
useEffect (() => {


    // get people ids which user would like displayed
   if(document){
      console.log('documents', document.myPersons)
      document.myPersons.map((p) => {
       console.log(`my person id`, p)
       people.push(p)
     })
   }
   console.log('people', people)

   // get each person's detail imformation
   for(let i = 0; i < people.length; i++) {
     const person = getPersonFromId(people[i])
       .then(function(data) {
         console.log('person in home', data )
        })
   }
},[document])
  
  if (error) {
    return <p className="error">${error}</p>
  }

  {!document &&<p className="loading">Loading...</p>}
  return (
    <div className="home">
        <h2 className="page-title">Home</h2>
        <ul className="persons">

        </ul>
        {error && <p className="error">${error}</p>}
        {document && <PersonList persons={people} />}
    </div>
  )
}

export { Home as default }
