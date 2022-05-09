// readme: remove from ui prev relatives as user clicks x
// callback function manages state to update current relatives UI
// props are two call back functions, relationship and a person

import { useEffect } from "react"

export default function RemoveRelatives({...props}) {
  const addPrevRelatives = props.addPrevRelatives
  const relatives = props.person[props.relationship]
  const relationship = props.relationship
  
  // remove this relative from the state in parent component
  // then remove from ui in stateless list
  const handleClick = (e) => {
    props.removePrevRelative(e)
    const removeRef = document.getElementById(e.target.value)
    removeRef.innerHTML = ''
  }

  useEffect(() => {
    addPrevRelatives(relatives, relationship)
  },[relatives, relationship])
    
  return (
    <div className="relatives">
      {relatives.length > 1 && <p>{relationship} to remove:</p>}
      <ul className="relative-list">
        {
          relatives.map(r => (
             <li key={r.id} id={r.id}>
                {r.name}
                <button 
                  className="btn delete-btn"
                  onClick={handleClick} 
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
