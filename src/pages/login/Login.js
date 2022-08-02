// log users in but if they are not email verified, log them out again
// and resend a verification email to them
import { useLogin } from '../../hooks/useLogin'
import { useState } from 'react'
import { getAuth, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { useLogout } from '../../hooks/useLogout'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import myLogger from '../../sharedFunctions/myLogger';

// styles
import './Login.css' 

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isPending, error } = useLogin()
  const { logout } = useLogout()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar() 
  
  // users must be verified
  const manageVerification = (user) => {
    if (!user.emailVerified) {
      sendEmailVerification(user)
      logout()
      enqueueSnackbar('A verification email has been sent to you. It may be in your spam folder.', { 
        variant: 'info',
      });
      navigate('/login')
    }
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      await login(email, password)
        .then((res) => manageVerification(res.user))
    } catch(err) {
      enqueueSnackbar(`an error occurred logging in, ${err}`, { 
        variant: 'error',
      })
      navigate('/login')
    }
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
       enqueueSnackbar('A reset password email has been sent, it may be in your spam folder', { 
          variant: 'success',
       });
     })
    .catch((error) => {
      myLogger(`Login: error setting password, ${error}`)
      enqueueSnackbar(`an error occurred, please enter your email address, ${error} ${error.code}`, { 
        variant: 'error',
      })
    });
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
        <span onClick={handleTriggerClick}>password (click here to view or hide):</span>
        <input 
          required
          id='password'
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
      </label>
      
        
          
        {!isPending && <button cy-test-id='loginBtn' className="btn">Login</button>}
        <span>             </span>
        <button
          cy-test-id="forgot-password"
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
