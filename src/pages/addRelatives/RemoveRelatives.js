// readme: remove from ui prev relatives as user clicks x
// manage state in calling function to update current relatives

import { useEffect } from "react"

export default function RemoveRelatives({...props}) {
    let html = 'temp'
    console.log('remove', props.prevRelatives[props.relationship])
    const relatives = props.prevRelatives[props.relationship]
    console.log('relatives', relatives)
    //const relativeListRef = document.getElementById('relative-list')
    //console.log('ref', relativeListRef)
    useEffect(() => {
      props.addPrevRelatives(relatives)
    },[])
    
  return (
    <ul className="relative-list">
        {
          relatives.map(r => (
             <li key={r.id}>
                {r.name}
                <button 
                  className="btn delete-btn"
                  onClick={(e, r) => props.removePrevRelative(e, r)} 
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
