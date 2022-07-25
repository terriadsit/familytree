// readme: remove from ui prev relatives as user clicks x
// callback function manages state to update current relatives UI
// props are two call back functions, relationship and a person

import { useEffect, useCallback } from "react"

// styles
import './AddRelatives.css'

export default function RemoveRelatives({...props}) {
  //const addPrevRelatives = props.addPrevRelatives
  const relatives = props.person[props.relationship]
  const relationship = props.relationship
  
  // remove this relative from the state in parent component
  // then remove from ui in stateless list
  const handleClick = (id, name) => {
    props.removePrevRelative(id, name)
    const removeRef = document.getElementById(id)
    removeRef.innerHTML = ''
  }

  const addPrevRelatives = useCallback( () => {
    return props.addPrevRelatives
  },[props.addPrevRelatives])


  useEffect(() => {
    addPrevRelatives(relatives, relationship)
  },[relatives, relationship, addPrevRelatives])
    
  return (
    <div className="relative-container">
      <p className="heading">{relationship} to remove:</p>
      <ul className="relative-list" >
        {
          relatives.map(r => (
             <li key={r.id} id={r.id}>
                {r.name}
                <button 
                  className="delete-btn"
                  onClick={() => handleClick(r.id, r.name)} 
                  value={r.id} 
                  name={r.name}
                  type='button'>
                  x
                </button>
             </li>
          ))
        }
     </ul>
    </div>
  )
}
