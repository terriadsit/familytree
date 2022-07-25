
import { NavLink } from 'react-router-dom'
import MemoizedListAll from './ListAll'

// styles and images
import './Sidebar.css'
import AddIcon from '../../assets/add_icon.svg'

export default function Sidebar({...props}) {
  let displayName = props.sbDisplayName
  
  return (
    <div className="sidebar">
        <div className="sidebar-content">
            <div className="user">
                {!displayName && <p>Welcome! <br></br>Please Sign Up and Login to access the options below.</p>}
                {displayName && <p>Welcome {displayName}!</p>}
            </div>
            <nav className="links">
              <ul>
                <li>
                  <NavLink to="/addperson?action=create">
                    <img src={AddIcon} alt="add icon" />
                    <span cy-test-id="add-person-link">Add a Person</span>
                  </NavLink> 
                </li>
                <li>
                  <NavLink to="/search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Search</span>
                  </NavLink>
                </li>
                <li><MemoizedListAll /></li>
              </ul>
            </nav>
        </div>
      </div>
  )
}
