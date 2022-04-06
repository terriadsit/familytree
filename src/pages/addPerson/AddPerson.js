import { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import Select from 'react-select'

// styles
import './AddPerson.css'
import { useFirestore } from '../../hooks/useFirestore'

export default function AddPerson() {
  // form fields
  const [name, setName] = useState('')
  const [otherName, setOtherName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [deathDate, setDeathDate] = useState('')
  const [birthCity, setBirthCity] = useState('')
  const [comments, setComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])

  
  const { addDocument } = useFirestore('people')
  const { user } = useAuthContext()

  // 'people' to populate drop down selects
  const { documents, error } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
 
  // later add diplay on home = true

  console.log('documents', documents, 'error', error)

  const formatRelatives = (relatives) => {
    const rels = relatives.map(r =>  {
      return { id: r.value, name: r.label }
    })
    return rels
  }
 
  const handleSiblingOption = (sib) => {
      const sibs = formatRelatives(sib)
      setSiblings(sibs)
  }

  const handleParentOption = (parent) => {
    const parents = formatRelatives(parent)
    setParents(parents)
  }

  const handleChildrenOption = (child) => {
    const children = formatRelatives(child)
    setChildren(children)
  }

  // populate people for select
  useEffect(() => {
    console.log('in useEffect doc:', documents)
    if(documents) {
      const options = documents.map(person => {
        console.log('in map',person.id, person.name)
        return { value: person.id, label: person.name }
      })
      setPeople(options)
    }

   },[documents])

 function handleSubmit(e) {
    e.preventDefault()
    const uid = user.uid
    const createdAt = new Date()
    console.log(name, otherName, birthDate, deathDate, birthCity, comments, uid)
    console.log('people', people)
    const person = {
      name,
      otherName,
      birthDate,
      deathDate,
      birthCity, 
      comments,
      siblings,
      parents,
      children,
      createdBy: uid,
      createdAt
    }
    addDocument(person)
    
  }
  
 
  return (
    <div className="add-person">
        <h2 className="page-title">Add a Person. Except for name, fields may be left blank.</h2>
        <form className="add-person-form"onSubmit={handleSubmit}>
          <label>
            <span>person's full birth name</span>
            <input 
              required
              type="text"
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </label>
          <label>
            <span>other names: married, nickname, etc.</span>
            <input 
              type="text"
              onChange={e => setOtherName(e.target.value)}
              value={otherName}
            />
          </label>
          <label>
            <span>birth date</span>
            <input 
              type="date"
              onChange={e => setBirthDate(e.target.value)}
              value={birthDate}
            />
          </label>
          <label>
            <span>death date</span>
            <input 
              type="date"
              onChange={e => setDeathDate(e.target.value)}
              value={deathDate}
            />
          </label>
          <label>
            <span>city of birth</span>
            <input 
              type="text"
              onChange={e => setBirthCity(e.target.value)}
              value={birthCity}
            />
          </label>
          <span>later you will be able to update this person to link to their siblings, parents and children if those people are presently not added </span>
            <br></br>
          <label>
            <span>choose siblings</span>
            <Select 
              isMulti
              onChange={(option) => {handleSiblingOption(option)}}
              options={people}
          />
          </label>
          
          <label>
            <span>choose parents</span>
            <Select 
              isMulti
              onChange={(option) => {handleParentOption(option)}}
              options={people}
          />
          </label>
         
          <label>
            <span>choose children</span>
            <Select 
              isMulti
              onChange={(option) => {handleChildrenOption(option)}}
              options={people}
          />
          </label>
          
          <label>
            <span>comments, memories, stories, etc.</span>
            <textarea 
              type="text"
              onChange={e => setComments(e.target.value)}
              value={comments}
            ></textarea>
          </label>
          
          <button className="btn">Add Person</button>
        </form>
    </div>
  )
}
