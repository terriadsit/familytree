import { useLogin } from '../../hooks/useLogin'
import { useState } from 'react'

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
        {isPending && <button className="btn" disabled>loading...</button>}
        {error && <div className="error">{error}</div>}
      </form>
  
  )
}
