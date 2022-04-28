import { useCollection } from "../../hooks/useCollection"
import { useState, useEffect } from "react"
import Select from 'react-select'
import formatNameList from "../../sharedFunctions/formatNameList"
import updateARelative from "../../manageFileStorage/updateARelative"
import { useDocument } from "../../hooks/useDocument"
import PersonSummary from "../person/PersonSummary"
import { useParams } from 'react-router-dom'

// styles
import './AddRelatives.css'

function AddRelatives() {

    // 'people' to populate drop down selects
    const { documents } = useCollection('people', null, null)
    const [people, setPeople] = useState([])
    
    // person who is getting relatives added
    let params = useParams()
    const personId = params.id
    const { document: tempdoc } = useDocument('people', personId )
    const person = { ...tempdoc }
    //let error = !person.name ? 'this person does not exist' : ''
    
    // populate people for select
    useEffect(() => {
        if(documents) {
          const options = documents.map(person => {
            return { value: person.id, label: person.name }
          })
          setPeople(options)
        }
    
       },[documents])

  // form fields
  const [spouses, setSpouses] = useState([])
  //const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
    
  let tempSibling = ''
  let siblings = []
  const name = person.name   
      
     // ui Sibling list
     const updateSiblings = (action) => {
       const sibsList = document.getElementById('sibs-list')
       if (action === 'add') { 
          const found = siblings.find(element => element.id === tempSibling.id )
          if (!found && tempSibling) {
            siblings.push(tempSibling) 
          }
       } else {
          const filtered = siblings.filter(sib => sib.id !== tempSibling.id)
          siblings = filtered
          console.log('must add or remove sibling')
      }
      const formattedSibs = formatNameList(siblings)
      sibsList.innerText = 'current siblings: ' + formattedSibs
    }
  
     const handleSiblingOption = (sib) => {
       tempSibling = { id: sib.value, name: sib.label }
     }
  
     const handleParentOption = (parent) => {
    //   //const parents = formatRelatives(parent)
    //  // setParents(parents)
     }
  
     const handleChildrenOption = (child) => {
    //   //const children = formatRelatives(child)
    //  // setChildren(children)
     }
    
    const handleSpousesOption = (spouse) => {
    //   //const s = formatRelatives(spouse)
    //   //setSpouses(spouse)
    }
  
    // // update any spouse(s)
    // for (let i = 0; i < spouses.length; i++) {
    //   updateARelative(spouses[i].id, personId, name, 'spouses', 'add')
    // }
  
    // // update any parents by adding this person as children
    // for (let i = 0; i < parents.length; i++) {
    //   updateARelative(parents[i].id, personId, name, 'children', 'add')
    // }
  
    // // update any children by adding this person as parent
    // for (let i = 0; i < children.length; i++) {
    //   updateARelative(children[i].id, personId, name, 'parents', 'add')
    // }
  
   
    const handleSubmit = (e) => {
      e.preventDefault()
     // add sibs to person in db
      for (let i = 0; i < siblings.length; i++) {
        updateARelative(personId, siblings[i].id, siblings[i].name, 'siblings', 'add')
      }
      // update any of their siblings
      for (let i = 0; i < siblings.length; i++) {
        updateARelative(siblings[i].id, personId, name, 'siblings', 'add')
      }
    }
  
    if (error) {
      return <div className="error">{error}</div>
    }
    
    if (!document) {
      return <div className="loading">Loading...</div>
    } 
    
    return (
      <div>
         <PersonSummary person={person} />
        <form onSubmit={handleSubmit}>
          <label>
            <span>choose siblings</span>
            <Select className="sibling"
              onChange={(option) => {handleSiblingOption(option)}}
              options={people}
            />
          </label>
          <button type="button" className="btn" onClick={() => updateSiblings('add')}>Add Sibling</button>
          <button type="button" className="btn" onClick={() => updateSiblings('remove')}>Remove Sibling</button>
          <p id='sibs-list'></p>
       
          <label>
            <span>choose parents</span>
            <Select 
              isMulti
              onChange={(option) => {handleParentOption(option)}}
              options={people}
          />
          </label>
         <label>
            <span>choose spouses</span>
            <Select 
              isMulti
              onChange={(option) => {handleSpousesOption(option)}}
              options={people}
          />
          </label>
          <label>
            <span>choose children</span>
            <Select 
              isMulti
              onChange={(option) => {handleChildrenOption(option)}}
              options={people}
          />
          </label> 
          <button className="btn">Add Relatives</button>
      </form>
    </div>
  )
}
export { AddRelatives as default}
