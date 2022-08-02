// a single form field to choose from all people in db
// then navigate to that persons page
// navigated to using /search with props: type='search'
// also used in <AddPerson /> to view possible duplicate with props type='duplicate'

import { useCollection } from '../../hooks/useCollection'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

// styles
import './Search.css'

export default function Search() {
  
  const navigate = useNavigate()
  const [person, setPerson] = useState('')

  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
  // populate people for select
  useEffect(() => {
    if(documents) {
      const options = documents.map(person => {
        return { value: person.id, label: person.name }
    })
    setPeople(options)
    }
  },[documents])

  const handleOption = (option) => {
    setPerson(option.value)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/person/${person}`)
  }
  return (
    <form onSubmit={handleSubmit} className="search">
       <label>
         <span className='heading'>All the people who have already been added:</span>
           <Select 
            className="relative"
            id="search"
            onChange={(option) => {handleOption(option)}}
            options={people}
         />
      </label>
      <button className='btn' onClick={handleSubmit}>View</button>
    </form>
   )
}
