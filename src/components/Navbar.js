import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

// styles and images
import './Navbar.css'


export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <div className="navbar">
        <ul>
           <li className='logo'>
               <i class="fa-brands fa-pagelines"></i>
               <span>Family Tree and Archive</span>
           </li>
           <li>
                <Link to="/contact">
                 Contact
                </Link>
            </li>  
            {user && (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/updateuser">Update Your Account</Link></li>
              </>
            )}
            {!user && (
              <>
                <li><Link to="/signup?action=create">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}

            {user && (
            <li>
                {!isPending && <button className="btn" onClick={logout}>Logout</button>}
                { isPending && <button className="btn" disabled>Logging out...</button>}
            </li>
            )}
        </ul>
    </div>
  )
}
