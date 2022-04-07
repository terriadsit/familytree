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
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [comments, setComments] = useState('')
  const [spouses, setSpouses] = useState([])
  const [marriageComments, setMarriageComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])

  const { addDocument } = useFirestore('people')
  const { user } = useAuthContext()

  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
 
  // later add diplay on home = true

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
  
  const handleSpousesOption = (spouse) => {
    const s = formatRelatives(spouse)
    setSpouses(s)
  }

  // populate people for select
  useEffect(() => {
    if(documents) {
      const options = documents.map(person => {
        return { value: person.id, label: person.name }
      })
      setPeople(options)
    }

   },[documents])

 const handleImageChange = (e) => {
   setImage(null)
   setImageError(null)
   let selected = e.target.files[0]
   console.log(selected)

   if (selected) {
     if (!selected.type.includes('image')) {
       setImageError('selected file must be an image')
       return
     }
     if (selected.size > 100000) {
       setImageError('selected file must be smaller than 100kb')
       return
     }
     setImage(selected)
     console.log('image updated')
    }
  }
  
 function handleSubmit(e) {
    e.preventDefault()
    const uid = user.uid
    const createdAt = new Date()
    const person = {
      name,
      otherName,
      birthDate,
      deathDate,
      birthCity, 
      image,
      comments,
      spouses,
      marriageComments,
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
          <label>
            <span>upload an image</span>
            <input 
              type="file"
              onChange={handleImageChange}
            />
          </label>
          {imageError && <p className='error'>{imageError}</p>}
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
            <span>choose spouses</span>
            <Select 
              isMulti
              onChange={(option) => {handleSpousesOption(option)}}
              options={people}
          />
          </label>
          <label>
            <span>marriage comments (dates, locations, etc.) </span>
            <input 
              type="text"
              onChange={e => setMarriageComments(e.target.value)}
              value={marriageComments}
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
