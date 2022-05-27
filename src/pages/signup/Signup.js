// signup sets up a firebase auth user if action is create or updates a user  
// also receives props to keep welcome user dispay name state correct in sidebar
// user display name state is managed by <App />

import { useSignup } from '../../hooks/useSignup'
import { useFirestore } from '../../hooks/useFirestore'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { dbFirestore } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { updateEmail,
         getAuth, 
         EmailAuthProvider, 
         updatePassword,
         updateProfile,
         reauthenticateWithCredential, 
         sendEmailVerification} 
         from "firebase/auth";

// styles
import './Signup.css'

export default function Signup({...props}) {
  // here a temporary Display Name tied to State in Parent <App />
  // in order to keep state updated in <Sidebar />
  // displayName in this <Signup /> is a form field and requires
  // state here
 const updateDisplayName = props.updateDisplayName
  
  //Query Parameters, action is 'create' for new add, no action for update
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const action = queryParams.get('action');
  
  // ui interface words to display
  const pageAction = action ? 'Signup' : 'Update'
  const toDo = action ? '' : 'update'

  // form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [checked, setChecked] = useState(false) 
  const [checkPassword, setCheckPassword] = useState('')
  const [prevPassword, setPrevPassword] = useState('')

  const { signup, isPending, error } = useSignup()
  const { logout } = useLogout()
  const { updateDocument } = useFirestore('users')
  const { user } = useAuthContext()
  const navigate = useNavigate()
  let userDetails
  let prevEmail = ''

  // if updating, need users details
  async function getUsersDetails() {
    try {
      const ref = doc(dbFirestore, 'users', user.uid)
 
      const docSnap = await getDoc(ref)
         
       if (docSnap.exists()) {
         userDetails = { ...docSnap.data() }
      } 
     
      setDisplayName(userDetails.displayName)
      setChecked(userDetails.shareEmail)
      setEmail(userDetails.email)
      prevEmail = email
      
    } catch(err) {
       console.log('error', err)
    }
  }
  
  // load form fields if updating 
  
  useEffect(() => {
    if(!action){
      getUsersDetails()
    
    } else {
      setDisplayName('')
      setEmail('')
      setChecked(false)
    }
  },[action])

  

  // toggle checking box to allow or hide email from other users
  const handleChange = () => {
    setChecked(!checked);
  };

  // toggle showing or hiding both passwords
  const handleTriggerClick = () => {
    const ref1 = document.getElementById('password1')
    const ref2 = document.getElementById('password2')
    if(ref1.getAttribute('type') === 'password'){
      ref1.setAttribute('type','text')
      ref2.setAttribute('type', 'text')
      ref1.value = password
      ref2.value = checkPassword
    } else {
      ref1.setAttribute('type','password')
      ref2.setAttribute('type', 'password')
    }
  }

  // passwords should match and not be empty
  const checkForMatch = (checkPW) => {
    const passwordError = document.getElementById('password-error')
    passwordError.innerText = ""
    if(password.trim() !== checkPW.trim()) {
      passwordError.innerText ='password fields must match'
      return false
    } else {
      return true
    }
  }
 
 
 // create a new user if action is create, 
 // else update a user
  const handleSubmit = async e => {
    e.preventDefault()
    updateDisplayName(displayName)
    // if a new user
      if (action === 'create') {
        // passwords must match and may not be blank when signing up
        if(checkForMatch(checkPassword)) {
          if (password.trim()) {
            const res = await signup(email, password, displayName, checked)
              .then((res) => sendEmailVerification(res.user))
            logout()
            alert('An email has been sent to you. Please verify your email.')
            navigate('/login')
          } else {
            alert('a password is required')
          }
        }
      } else {
        // update current user
        // need new user credential for updates
        const credential = EmailAuthProvider.credential(
          user.email,
          prevPassword
        )
        await reauthenticateWithCredential(
          user, 
          credential
        )
        // update password if it is changed
        if (password) {
          if (checkForMatch(checkPassword)) {
            updatePassword(user, password).then(() => {
              // Update successful.
            }).catch((error) => {
              // An error ocurred
              alert('password update unsuccessful')
            });
          }
        }
        // update email if it has been changed 
        // update in firebase auth and in firestore user db while updating entire user 
        if (prevEmail !== email) {
          updateEmail(user, email).then(() => {
          }).catch((error) => {
            alert('an error occurred updating your email address', error.message)
          });
        }
        // update display name in firebase auth
        updateProfile(user, {
          displayName: displayName
        })
        // update entire user in user db
        const updates = {
          email,
          shareEmail: checked,
          displayName
        }
        updateDocument(user.uid, updates)
      }
      if (user) {
        navigate('/')
      }
  } 
  
  if (error) {
    return <p className='error'>error signing up, {error}</p>
  }
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{pageAction}</h2>
      <label>
        <span>{toDo} email:</span>
        <input 
          required
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </label>
      
      {!action && 
        <label>
          <span >current password:</span>
          <input 
            required
            id='prevPassword'
            type="password"
            onChange={e => setPrevPassword(e.target.value)}
            value={prevPassword}
          />
        </label>
      }
        <label>
          <span className='trigger' onClick={handleTriggerClick}>{toDo} password:</span>
          <input 
            id='password1'
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
      </label>
      <label>
          <span onClick={handleTriggerClick}>check password (click here to view or hide both):</span>
          <input 
            
            id='password2'
            type="password"
            onChange={e => {
              setCheckPassword(e.target.value)
              checkForMatch(e.target.value)
            }}
            value={checkPassword}
          />
        <span id="password-error"></span>
      </label>
      
      <label>
        <span>{toDo} display name (will be shown to all users next to your entries):</span>
        <input 
          required
          type="text"
          onChange={e => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>Check to allow other users access to your email address:</span>
        <input 
          type="checkbox"
          onChange={handleChange}
          checked={checked}
        />
      </label>
        
        {!isPending && <button className="btn">{pageAction}</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <div className="error">{error}</div>}
        
      </form>
  )
}
