//import { useDocument } from '../../hooks/useDocument'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { dbFirestore } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

// styles 
import './UpdatePerson.css'

export default function UpdatePerson() {
  let params = useParams()
  const personId = params.id
  const [error, setError] = useState('')
    
  // form fields
  const [name, setName] = useState('')
  const [otherName, setOtherName] = useState('')


  async function getPersonDetails(personId) {
    let person = {}
    try {
      const ref = doc(dbFirestore, 'people', personId)
 
      const docSnap = await getDoc(ref)
         
       if (docSnap.exists()) {
         person = { ...docSnap.data() }
      } 
      setName(person.name)

    } catch(err) {
      setError(err)
      console.log('error', err)
    }
  }

  getPersonDetails(personId)

  const handleSubmit = (e) => {

  }

  
  
  if (error) {
    return <div className="error">{error}</div>
  }
  
  if (!document) {
    return <div className="loading">Loading...</div>
  }



  return (
    <div className="person-details">
      <div className="add-person">
        <h2 className="page-title">Edit. Except for name, fields may be left blank.</h2>
        <form className="add-person-form" id="add-form" onSubmit={handleSubmit}>
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
        </form>
      </div>
        
    </div>
  )
}
