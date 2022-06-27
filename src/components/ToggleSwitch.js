// a toggle component, managed by props to show checked 
// and also to manage a click

import { useEffect } from "react";

// styles
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({...props }) => {
  
  const isChecked = props.checked
 
  useEffect(() => {
    if (isChecked) {
      document.getElementById("myCheck").checked = true
    } 
  },[isChecked])

  // calling component manages event
  const handleClick = (e) => {
    props.handleToggle(e.target.checked)
  }

  return (
    <div className="toggle-container">
      <div className="toggle-switch">
        <div>
          on Home Page? <input type="checkbox" id="myCheck" onChange={handleClick} />
        </div>
      </div>
    </div>
  )
}
  
export default ToggleSwitch;