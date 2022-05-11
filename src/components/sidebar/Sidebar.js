
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import Search from './Search'
import ListAll from './ListAll'

// styles and images
import './Sidebar.css'
// import DashboardIcon from '../../assets/dashboard_icon.svg'
import AddIcon from '../../assets/add_icon.svg'

export default function Sidebar() {
  const { user } = useAuthContext()
  
  const displayName = user ? user.displayName : ''

  return (
    <div className="sidebar">
        <div className="sidebar-content">
            <div className="user">
                <p>Welcome {displayName}!</p>
            </div>
            <nav className="links">
              <ul>
                <li>
                  <NavLink to="/addperson?action=create">
                    <img src={AddIcon} alt="add icon" />
                    <span>Add a Person</span>
                  </NavLink> 
                </li>
                <li>
                  <NavLink to="/search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Search</span>
                  </NavLink>
                </li>
                <li><ListAll /></li>
              </ul>
            </nav>
        </div>
      </div>
  )
}
