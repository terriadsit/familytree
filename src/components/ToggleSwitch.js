// a toggle component, manged by props to show checked 
// and also to manage a clidk

import { useEffect } from "react";

// styles
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({...props }) => {
  
  const isChecked = props.checked
  console.log('checkbox', isChecked)
  // if props say box should be pre checked
  // if (checked) {
  //   checkBoxRef.setAttribute('checked', true)
  // }

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