import { useSignup } from '../../hooks/useSignup'
import { useState } from 'react'


// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [checked, setChecked] = useState(false) 
  const [checkPassword, setCheckPassword] = useState('')
  const { signup, isPending, error } = useSignup()
  
  const handleChange = () => {
    setChecked(!checked);
  };

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

  const checkForMatch = (checkPW) => {
    const passwordError = document.getElementById('password-error')
    passwordError.innerText = ""
    if(password.trim() !== checkPW.trim()){
      passwordError.innerText ='password fields must match'
      return false
    } else {
      return true
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if(checkForMatch(checkPassword)){
      signup(email, password, displayName, checked)

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
        {!isPending && <button className="btn">Sign up</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <div className="error">{error}</div>}
      </form>
  )
}
