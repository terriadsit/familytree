import { useSignup } from '../../hooks/useSignup'
import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { dbFirestore } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { updateEmail, EmailAuthProvider } from "firebase/auth";

// styles
import './Signup.css'

export default function Signup() {

  //Query Parameters, action is 'create' for new add, no action for update
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const action = queryParams.get('action');
  console.log('signup', action)
  const buttonLabel = action ? 'Signup' : 'Update'

  // form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [checked, setChecked] = useState(false) 
  const [checkPassword, setCheckPassword] = useState('')
  const [prevPassword, setPrevPassword] = useState('')

  const { signup, isPending, error } = useSignup()
  const { user } = useAuthContext()
  let userDetails
  let prevEmail = ''

  // if updating, need users details
  async function getUsersDetails() {
    try {
      const ref = doc(dbFirestore, 'users', user.uid)
 
      const docSnap = await getDoc(ref)
         
       if (docSnap.exists()) {
         userDetails = { ...docSnap.data() }
         console.log('user details', userDetails)
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
    if(password.trim() !== checkPW.trim() || password.trim() === '') {
      passwordError.innerText ='password fields must match and not be blank'
      return false
    } else {
      return true
    }
  }
 
 
 // create a new user if action is create, 
 // else update a user
  const handleSubmit = e => {
    e.preventDefault()
    // if a new user
      if (action === 'create') {
        // passwords must match
        if(checkForMatch(checkPassword)) {
          signup(email, password, displayName, checked)
        }
      } else {
        // need user credential for updates
        const credential = EmailAuthProvider.credential(
          user.email,
          prevPassword
        )
        // update password if it is changed

        // update email if it has been changed 
        // update in firebase auth and in firestore user db
        if (prevEmail !== email) {
          console.log('new Email', credential, user, email)
          updateEmail(user, email).then(() => {
              console.log('email updated',email)
  
          }).catch((error) => {
            alert('an error occurred updating your email address', error.message)
          });
        }
      }
  } 
  

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign up</h2>
      <label>
        <span>email:</span>
        <input 
          required
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </label>
      
      {!action && 
        <label>
          <span >Current Password:</span>
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
          <span className='trigger' onClick={handleTriggerClick}>password:</span>
          <input 
            required
            id='password1'
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
      </label>
      <label>
          <span onClick={handleTriggerClick}>check password (click here to view or hide both):</span>
          <input 
            required
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
        <span>Display Name (will be shown to all users next to your entries):</span>
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
        
        {!isPending && <button className="btn">{buttonLabel}</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <div className="error">{error}</div>}
        {!action &&      
         <p>Passwords may be updated using the "forgot password" link on the Login Page</p> 
        }
      </form>
  )
}
