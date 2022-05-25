import { useLogin } from '../../hooks/useLogin'
import { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


// styles
import './Login.css' 



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isPending, error } = useLogin()

  const handleSubmit = e => {
    e.preventDefault()
    login(email, password)
  }

  const handleTriggerClick = () => {
    const ref1 = document.getElementById('password')
    if(ref1.getAttribute('type') === 'password'){
      ref1.setAttribute('type','text')
      ref1.value = password
    } else {
      ref1.setAttribute('type','password')
    }
  }

  const handleGetPassword = () => {
    
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
     .then(() => {
       alert('password email sent to provided email')
    // Password reset email sent!
    // ..
     })
    .catch((error) => {
      alert('error sending password email, please provide a valid password', error, error.code)
    });
  }

  if (error) {
    return <p className='error'>error logging in. {error.message}</p>
  }
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
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
        <span onClick={handleTriggerClick}>Password (click here to view or hide):</span>
        <input 
          required
          id='password'
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
      </label>
      
        
          
        {!isPending && <button className="btn">Login</button>}
        <span>             </span>
        <button
          className='btn'
          type="button"
          onClick={handleGetPassword}
        > Forgot Password     
        </button>
        {isPending && <button className="btn" disabled>loading...</button>}
        {error && <div className="error">{error}</div>}
      </form>
  
  )
}
