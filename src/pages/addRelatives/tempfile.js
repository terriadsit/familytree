// readme: remove from ui prev relatives as user clicks x
// callback function manages state to update current relatives UI
// props are two call back functions, relationship and a person

import { useEffect, useMemo, useCallback } from "react"

// styles
import './AddRelatives.css'

export default function RemoveRelatives({...props}) {
  //const addPrevRelatives = props.addPrevRelatives
  //const relatives = props.person[props.relationship]
  //const relationship = props.relationship
  const tempRelatives = props.person[props.relationship]
  const tempRelationship = props.relationship
  
  // remove this relative from the state in parent component
  // then remove from ui in stateless list
  const handleClick = (id, name) => {
    props.removePrevRelative(id, name)
    const removeRef = document.getElementById(id)
    removeRef.innerHTML = ''
  }
  const memoizedRelatives = useMemo(() => tempRelatives, [tempRelatives]);
  const memoizedRelationship = useMemo(() => tempRelationship, [tempRelationship]);
  
  const addPrevRelatives = useCallback(
    () => {
      props.addPrevRelatives(memoizedRelatives, memoizedRelationship)
    },
    [memoizedRelatives, memoizedRelationship],
  )
  useEffect(() => {
    addPrevRelatives(memoizedRelatives, memoizedRelationship)
  },[])
    
  return (
    <div className="relative-container">
      <p className="heading">{tempRelationship} to remove:</p>
      <ul className="relative-list" >
        {
          tempRelatives.map(r => (
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
