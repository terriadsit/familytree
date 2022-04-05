import { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import Select from 'react-select'

// styles
import './AddPerson.css'

export default function AddPerson() {
  const [people, setPeople] = []
  const [name, setName] = useState('')
  const [otherName, setOtherName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [deathDate, setDeathDate] = useState('')
  const [birthCity, setBirthCity] = useState('')
  const [comments, setComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  const { user } = useAuthContext()
  const { documents, error } = useCollection('people', null, null)
 
  // later add createdAt, createdBy, diplay on home = true

  // later get all persons from db for select choice

  const peopleInDB = [
    { value: "uid1", label: "Ray"},
    { value: "uid2", label: "Jean"},
    { value: "uid3", label: "Christy"},
    { value: "uid4", lable: "Michael"}
  ]

  const checkForMatch =  (who, relationship) => {
    let ids = []
    let found = null
    switch(relationship) {
      case "sibling":
        ids = siblings.map(s => s.value)
        break
      case "parent":
        ids = parents.map(p => p.value)
        break
      case "children":
        ids = children.map(c => c.value)
        break
      default:
        console.log('wrong case')
    }
    found = ids.find(id => who.value === id)
    return found
  }

  const handleSiblingOption = (sib) => {
    const found = checkForMatch(sib, "sibling")
    if(!found){
        setSiblings((prevSiblings) => [...prevSiblings, sib])
    }
  }

  const handleParentOption = (parent) => {
    const found = checkForMatch(parent, "parent")
    if(!found){
      setParents((prevParents) => [...prevParents, parent])
    }
  }

  const handleChildrenOption = (child) => {
    const found = checkForMatch(child, "children")
    if(!found){
      setChildren((prevChildren) => [...prevChildren, child])
    }
  }

  // populate people for select
  useEffect((documents) => {
    if(documents) {
      const options = documents.map(person => {
        return { value: person.uid, label: person.name }
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
      createdBy: uid
      //createdAt: 
    }
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
          <p>Current siblings: {siblings.map((s) => <em key={s.value}>{s.label}, </em>)}</p>
          <label>
            <span>choose parents</span>
            <Select 
              isMulti
              onChange={(option) => {handleParentOption(option)}}
              options={people}
          />
          </label>
          <p>Current parents: {parents.map((p) => <em key={p.value}>{p.label}, </em>)}</p>
          <label>
            <span>choose children</span>
            <Select 
              isMulti
              onChange={(option) => {handleChildrenOption(option)}}
              options={people}
          />
          </label>
          <p>Current children: {children.map((c) => <em key={c.value}>{c.label}, </em>)}</p>
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
