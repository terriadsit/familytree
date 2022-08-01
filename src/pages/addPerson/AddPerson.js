// add or update a new person to the db depending on "action"
// then navigate to <AddRelatives> to add or update relatives
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { dbFirestore } from '../../firebase/config'
import ifNameChange from "../../manageFileStorage/ifNameChange"
import checkFile from "../../manageFileStorage/checkFile"
import compressImage from '../../manageFileStorage/compressImage'
import deleteStoredImage from '../../manageFileStorage/deleteStoredImage'
import updateMyPersons from '../../manageFileStorage/updateMyPersons'
import myLogger from "../../sharedFunctions/myLogger"
import { useSnackbar } from 'notistack'
import CheckPerson from "./CheckPerson"

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
  const [fileError, setFileError] = useState(null)
  const [comments, setComments] = useState('')
  const [spouses, setSpouses] = useState([])
  const [marriageComments, setMarriageComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  const [originalName, setOriginalName] = useState('')

  // checking for duplicates when user types a new name
  const [nameChange, setNameChange] = useState(false)

  // need persons creator to allow updates, keep seperate from createdBy for adding persons
  const [personCreator, setPersonCreator] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { enqueueSnackbar } = useSnackbar();
  const { addDocument, updateDocument } = useFirestore('people')
  const { user } = useAuthContext()
  console.log('in AddPerson')
  
  let navigate = useNavigate()
  
  // message at top of page is Add or Update
  const [message, setMessage] = useState('Add')
  
  // if updating, need persons details
  const getPersonDetails = useCallback(async () => {
      let person = {}
      try {
        const ref = doc(dbFirestore, 'people', personId)
 
        const docSnap = await getDoc(ref)
         
         if (docSnap.exists()) {
           person = { ...docSnap.data() }
        } else {
          navigate('/')
        }
        setName(person.name)
        setOtherName(person.otherName)
        setBirthDate(person.birthDate)
        setDeathDate(person.deathDate)
        setBirthCity(person.birthCity)
        setImage(null)
        setImageUrl(person.imageUrl)
        setFileError(null)
        setComments(person.comments)
        setSpouses(person.spouses)
        setMarriageComments(person.marriageComments)
        setSiblings(person.siblings)
        setParents(person.parents)
        setChildren(person.children)
        setPersonCreator(person.createdBy.uid)
        setLoading(false)
        setMessage('Update')
        setOriginalName(person.name)
      } catch(err) {
         myLogger(err)
      }
  }, [navigate, personId])
  
  useEffect(() => {
    if(!action){
      getPersonDetails()
    } else {
      setLoading(false)
      setName('')
      setOtherName('')
      setBirthDate('')
      setDeathDate('')
      setBirthCity('')
      setImage(null)
      setImageUrl(null)
      setFileError(null)
      setComments('')
      setSpouses([])
      setMarriageComments('')
      setSiblings([])
      setParents([])
      setChildren([])
    }
  },[action, personId, getPersonDetails])

  function tooLargeError()  {
    setFileError('the image is too large, see FAQ for more information')
    enqueueSnackbar(`the image is too large, see FAQ for more information`, { 
      variant: 'error',
    })
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    setNameChange(true)
  }

  const handleImageChange = (e) => {
    setFileError(null)
    let selected = e.target.files[0]
    if (selected) {
     const error = checkFile('image',selected)
       if (!error) {
        setImage(selected)
        setImageUrl('')
       } else {
         setFileError(error)
       }
    }
  }

  const deleteImage = () => {
    deleteStoredImage(imageUrl)
    setImageUrl(null)
    
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
      
      // now add image to storage, uploadFile will update person imageUrl 
      // compressImage will call uploadFile()
      // now add image, pdf to storage, uploadFile will update  imageUrl 
      // compressImage calls uploadFile wh/ updates imageUrl
      
      if (image) {
        compressImage(image, personId, personId, tooLargeError)
      }
      // add personid and Birthday to users home page personList
      updateMyPersons(uid, personId, 'add')
      
      // navigate to add relatives or home
      if (e.target.value === 'home') {
        navigate('/')
      } else {
        navigate(`/addrelatives/${personId}`)
      }
    } else {
      // update this person instead of add

      // names must be changed in relatives if name is changed
      if (originalName !== name ) {
        await ifNameChange(personId, originalName, name)
      }

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

      // now add image to storage, uploadFile will update person imageUrl 
      // uploadImage called in compressImage
      if (image) {
        compressImage(image, personId, personId, tooLargeError)
      }
      // navigate to add relatives or home
      if (e.target.value === 'home') {
        navigate('/')
      } else {
        navigate(`/addrelatives/${personId}`)
      }
    }
  }
  if (loading) {
    return <div>Loading...</div>
  }


  if (!action && (user.uid !== personCreator)) {
    return <div className="error">only the creator of this entry for {name} is able to edit</div>
  }
  

  return (
    <div className="add-person">
        <h2 className="page-title">{message } person details. Except for name, fields may be left blank.</h2>
        <p>Best practice is to let living persons add themselves. See FAQ for more information.</p>
        <form className="add-person-form" id="add-form" onSubmit={handleSubmit}>
          <div className="name-check-container">
            <label className="name new-name">
              <span>person's full birth name</span>
              <input 
                cy-test-id="name"
                required
                type="text"
                onChange={handleNameChange}
                onPointerOut={() => setNameChange(false)} 
                value={name}
              />
            </label>
            <div className="name check-name">
              {nameChange && <CheckPerson name={name}/>}
            </div>
          </div>
          <label>
            <span>other names: married, nickname, etc.</span>
            <input 
              cy-test-id="other-name"
              type="text"
              onChange={e => setOtherName(e.target.value)}
              value={otherName}
            />
          </label>
          <label>
            <span>birth date</span>
            <input 
              cy-test-id="birth-date"
              type="date"
              onChange={e => setBirthDate(e.target.value)}
              value={birthDate}
            />
          </label>
          <label>
            <span>death date</span>
            <input 
              cy-test-id="death-date"
              type="date"
              onChange={e => setDeathDate(e.target.value)}
              value={deathDate}
            />
          </label>
          <label>
            <span>city and state of birth</span>
            <input 
              cy-test-id="birth-place"
              type="text"
              onChange={e => setBirthCity(e.target.value)}
              value={birthCity}
            />
          </label>
          {!imageUrl &&
             <label>
              <span>upload an image</span>
              <input 
                cy-test-id="image"
                type="file"
                onChange={handleImageChange}
              />
            </label>
          }
          {imageUrl && 
          <div>
            <img 
              cy-test-id="image"
              className="image"
              src={imageUrl} 
              alt="person" 
            />
            <button 
              cy-test-id="delete-image"
              type="button"
              onClick={deleteImage}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>}
          {fileError && <p className='error'>{fileError}</p>}
          <label>
            <span>marriage comments (dates, locations, etc.) </span>
            <input 
              cy-test-id="marriage-comments"
              type="text"
              onChange={e => setMarriageComments(e.target.value)}
              value={marriageComments}
            />
          </label>
          
          <label>
            <span>comments, memories, stories, etc.</span>
            <textarea 
              cy-test-id="comments"
              type="text"
              onChange={e => setComments(e.target.value)}
              value={comments}
            ></textarea>
          </label>
          <button 
            cy-test-id="add-relatives"
            className="btn"
            type="button"
            value="add-relatives"
            onClick={handleSubmit}
          >
            Save and Add Relatives
          </button>
          <span> or </span>
          <button 
            cy-test-id="submit-form"
            className="btn"
            type="button"
            value="home"
            onClick={handleSubmit}
          >
            Save
          </button>
          <br></br>
          <span>later you will be able to update this person to link to their siblings, parents and children if those people are presently not added </span>
        </form>
        
        <br></br>  
          
    </div>
  )
}