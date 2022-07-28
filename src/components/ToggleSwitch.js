// a toggle component, managed by props to show checked 
// and also to manage a click

import { useEffect } from "react";

// styles
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({...props }) => {
  const isChecked = props.onHome
  
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
    
      <div >
        <label className="get-inline">
          <input type="checkbox" id="myCheck" onChange={handleClick} />
          on my Home Page? 
        </label>
      </div>
    
  )
}
  
export default ToggleSwitch;