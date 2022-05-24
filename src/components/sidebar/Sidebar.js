
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import ListAll from './ListAll'

// styles and images
import './Sidebar.css'
import AddIcon from '../../assets/add_icon.svg'
import { useEffect, useState } from 'react'

export default function Sidebar({...props}) {
  const { user } = useAuthContext()
  let displayName = props.displayName
  //const [displayName, setDisplayName] = useState('')
  console.log('user', props)

  // let tempDisplayName = user ? user.displayName : ''

  // useEffect(() => {
  //   setDisplayName(tempDisplayName)
  // }, [tempDisplayName])

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
