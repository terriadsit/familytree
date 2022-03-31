
import { NavLink } from 'react-router-dom'
import Search from './Search'
import ListAll from './ListAll'

// styles and images
import './Sidebar.css'
// import DashboardIcon from '../../assets/dashboard_icon.svg'
import AddIcon from '../../assets/add_icon.svg'

export default function Sidebar() {
  
 
  return (
    <div className="sidebar">
        <div className="sidebar-content">
            <div className="user">
                {/* user here later */}
                <p>Welcome !</p>
            </div>
            <nav className="links">
              <ul>
                <li>
                  <NavLink to="/addperson">
                    <img src={AddIcon} alt="add icon" />
                    <span>Add a Person</span>
                  </NavLink> 
                </li>
                <li><Search /></li>
                <li><ListAll /></li>
              </ul>
            </nav>
        </div>
      </div>
  )
}
