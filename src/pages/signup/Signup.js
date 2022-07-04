// signup sets up a firebase auth user if action is create or updates a user  
// also receives props to keep welcome user dispay name state correct in sidebar
// user display name state is managed by <App />

import getNewAuth from '../../sharedFunctions/getNewAuth'
import { useSnackbar } from 'notistack'
import { useSignup } from '../../hooks/useSignup'
import { useFirestore } from '../../hooks/useFirestore'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { dbFirestore } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { updateEmail,
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
  const [prevEmail, setPrevEmail] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { enqueueSnackbar } = useSnackbar()
  const { signup, isPending, error } = useSignup()
  const { logout } = useLogout()
  const { updateDocument } = useFirestore('users')
  const { user } = useAuthContext()
  const navigate = useNavigate()
  let userDetails
  

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
      setPrevEmail(userDetails.email)
      console.log('in getuserdetails prevemail, ', prevEmail,'email',email,'ud',userDetails.email,'dName', displayName)
         
      
    } catch(err) {
        enqueueSnackbar(`an error occurred ${err}`, { 
        variant: 'error',
      })
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
    console.log('trigger click', email, 'prevemail', prevEmail)
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
    setPasswordError('')
    if(password.trim() !== checkPW.trim()) {
      setPasswordError('password fields must match')
      return false
    } else {
      return true
    }
  }
 
function authError(error) {
  enqueueSnackbar(`Error updating. Please Login again. ${error}`,  { 
    autoHideDuration: 7000,
    variant: 'error',
    })
    logout()
}


function getVerified(user) {
  sendEmailVerification(user)
  logout()
  enqueueSnackbar(`A verification email has been sent to you, it may be in your spam folder.`, 
    { 
      variant: 'info',
    })
  navigate('/login')
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
            await signup(email, password, displayName, checked)
              .then((res) => {
                if (res) {
                  getVerified(res.user)
                }
              })
          } else {
            enqueueSnackbar('a password is required', { 
              variant: 'error',
            })
          }
        }
      } else {
        // update current user
        // need new user credential for updates
        // else error occurs if it has been a while since user signed in
        getNewAuth(user, email, prevPassword, authError)
        .then(() => {
          // update password if it is changed
          if (password) {
            if (checkForMatch(checkPassword)) {
              try {
              updatePassword(user, password).then(() => {
                // Update successful.
                getNewAuth(user, email, password, authError)
                // prevPassword used to update email if email is updated below
                setPrevPassword(password)
              })
              } catch (error) {
                // An error ocurred
                enqueueSnackbar(`password update was unsuccessful, ${error}`, { 
                  variant: 'error',
                })
                logout()
              };
            }
          }
        
          // update email if it has been changed 
          // update in firebase auth and in firestore user db while updating entire user 
          console.log('before prevemail, ', prevEmail,'email',email)
          
          if (prevEmail !== email) {
            console.log('prevemail, ', prevEmail,'email',email)
            updateEmail(user, email)
            .then(() => {
                getVerified(user)
            }).catch((error) => {
              enqueueSnackbar(`an error occurred updating your email address ${error.message}`, { 
                variant: 'error',
              })
            });
          }
        })
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
  
  
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{pageAction}</h2>
      <label>
        <span>{toDo} email:</span>
        <input 
          placeholder="email"
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
            placeholder="current password"
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
            placeholder="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
      </label>
      <label>
          <span onClick={handleTriggerClick} cy-test-id='triggerBtn'>check password (click here to view or hide both):</span>
          <input 
            placeholder="check password"
            id='password2'
            type="password"
            onChange={e => {
              setCheckPassword(e.target.value)
              checkForMatch(e.target.value)
            }}
            value={checkPassword}
          />
        {passwordError && <span id="password-error">{passwordError}</span>}
      </label>
      
      <label>
        <span>{toDo} display name (will be shown to all users next to your entries):</span>
        <input 
          required
          placeholder="display name"
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
        
        {!isPending && <button cy-test-id="submit-form" className="btn">{pageAction}</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && 
            <div className="error">{error}  <br></br>
               Please fix the error and click the Signup button again
            </div>
        }
        
      </form>
  )
}
