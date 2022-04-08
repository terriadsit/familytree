// import styles
import './PersonList.css'

export default function PersonList(persons) {
    console.log('persons', persons)
  return (
     
    <div>
       {persons.length === 0 && <p>no persons have been selectd by you</p> } 
       <div>length: {persons.length}</div>
       {/* {persons.map(p => (
           <div key={p.id}>
               {p.displayName}
           </div>
       ))}  */}
    </div>
  )
}
