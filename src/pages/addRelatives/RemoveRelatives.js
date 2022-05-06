// readme: remove from ui prev relatives as user clicks x
// callback function manages state to update current relatives UI

import { useEffect } from "react"

export default function RemoveRelatives({...props}) {
  const addPrevRelatives = props.addPrevRelatives
  console.log('remove', props.prevRelatives[props.relationship])
  const relatives = props.prevRelatives[props.relationship]
  console.log('relatives', relatives)
  //const removeRef = querySelector()

  const handleClick = (e) => {
    props.removePrevRelative(e)
    const removeRef = document.getElementById(e.target.value)
    removeRef.innerHTML = ''
  }

    
  useEffect(() => {
    addPrevRelatives(relatives)
  },[relatives])
    
  return (
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
  )
}
