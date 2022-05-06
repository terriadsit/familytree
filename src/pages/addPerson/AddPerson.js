// add or update a new person to the db depending on "action"
// then navigate to <AddRelatives> to add or update relatives

import { useEffect, useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { dbFirestore } from '../../firebase/config'

import checkImage from '../../manageFileStorage/checkImage'
import updateMyPersons from '../../manageFileStorage/updateMyPersons'
import { uploadImage } from '../../manageFileStorage/uploadImage'

import { useNavigate, useLocation, useParams } from "react-router-dom"

// styles
import './AddPerson.css'

export default function AddPerson() {
  //Query Parameters, action is 'create' for new add, no action for update
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const action = queryParams.get('action');
  
  //Route parameteres
  const params = useParams();
  let personId = params.id;
  
  // form fields
  const [name, setName] = useState('')
  const [otherName, setOtherName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [deathDate, setDeathDate] = useState('')
  const [birthCity, setBirthCity] = useState('')
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [comments, setComments] = useState('')
  const [spouses, setSpouses] = useState([])
  const [marriageComments, setMarriageComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  
  const { addDocument, updateDocument } = useFirestore('people')
  const { user } = useAuthContext()
  let navigate = useNavigate()
  
  async function getPersonDetails() {
    let person = {}
    try {
      const ref = doc(dbFirestore, 'people', personId)
 
      const docSnap = await getDoc(ref)
         
       if (docSnap.exists()) {
         person = { ...docSnap.data() }
      } 
      setName(person.name)
      setOtherName(person.otherName)
      setBirthDate(person.birthDate)
      setDeathDate(person.deathDate)
      setBirthCity(person.birthCity)
      setImage(null)
      setImageUrl(person.imageUrl)
      setImageError(null)
      setComments(person.comments)
      setSpouses(person.spouses)
      setMarriageComments(person.marriageComments)
      setSiblings(person.siblings)
      setParents(person.parents)
      setChildren(person.children)

    } catch(err) {
      
      console.log('error', err)
    }
  }

  useEffect(() => {
    if(!action){
      getPersonDetails()
    
    } else {
      setName('')
      setOtherName('')
      setBirthDate('')
      setDeathDate('')
      setBirthCity('')
      setImage(null)
      setImageUrl(null)
      setImageError(null)
      setComments('')
      setSpouses([])
      setMarriageComments('')
      setSiblings([])
      setParents([])
      setChildren([])
    }
  },[action, personId])

 const handleImageChange = (e) => {
   setImage(null)
   setImageError(null)
   let selected = e.target.files[0]
   if (selected) {
    const error = checkImage(selected)
      if (!error) {
       setImage(selected)
       setImageUrl('')
      } else {
        setImageError(error)
      }
   }
  }
  
 const handleSubmit = async (e) => {
    
    e.preventDefault() 
    if (action) {
      // add a new person to db
      const uid = user.uid
      const createdAt = serverTimestamp()
      const person = {
        name,
        otherName,
        birthDate,
        deathDate,
        birthCity, 
        imageUrl,
        comments,
        spouses,
        marriageComments,
        siblings,
        parents,
        children,
        createdBy: {uid: user.uid, createdByName: user.displayName},
        createdAt,
        onUsers: [user.uid]
      }
      // now get personid
      let personId = await addDocument(person)
       
      // now add image to storage, uploadImage will update person imageUrl 
      await uploadImage(image, personId, personId)
     
      // add personid and Birthday to users home page personList
      updateMyPersons(uid, personId, birthDate, 'add')
      
      // navigate to add relatives
      navigate(`/addrelatives/${personId}`)
    } else {
      // update this person instead of add
      const updatedPerson =  {
        name,
        otherName,
        birthDate,
        deathDate,
        birthCity, 
        imageUrl,
        comments,
        spouses,
        marriageComments
      }
      await updateDocument(personId, updatedPerson)

      // navigate to add or update relatives
      navigate(`/addrelatives/${personId}`)
    }
    
 
    

  }
  
  return (
    <div className="add-person">
        <h2 className="page-title">Add a Person. Except for name, fields may be left blank.</h2>
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
          <label>
            <span>marriage comments (dates, locations, etc.) </span>
            <input 
              type="text"
              onChange={e => setMarriageComments(e.target.value)}
              value={marriageComments}
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
        <br></br>
        <span>later you will be able to update this person to link to their siblings, parents and children if those people are presently not added </span>
           
          
    </div>
  )
}