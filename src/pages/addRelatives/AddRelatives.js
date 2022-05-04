import { useCollection } from "../../hooks/useCollection"
import { useState, useEffect } from "react"
import formatNameList from "../../sharedFunctions/formatNameList"
import updateARelative from "../../manageFileStorage/updateARelative"
import { useDocument } from "../../hooks/useDocument"
import PersonDetails from "../../components/PersonDetails"
import { useParams } from 'react-router-dom'
import ChooseRelatives from './ChooseRelatives'
import Select from 'react-select'

// styles
import './AddRelatives.css'

function AddRelatives() {

  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
    
  // person who is getting relatives added
  let params = useParams()
  const personId = params.id
  const { data: tempdoc } = useDocument('people', personId )
  const person = { ...tempdoc }
  const name = person.name   

  let error = !person.name ? 'this person does not exist' : ''
    
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
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])

  let tempRelative = ''
  let tempRelatives = []   
  
  const relationships = {
    sib: 'sibling',
    spo: 'spouse',
    par: 'parent',
    chi: 'child'
  };

  // set up props for components
  let chooseSiblingProps = {
    relationship: 'sibling',
    people: [...people],
    updateRelatives: (action) => updateRelatives(action),
    handleRelativeOption: (rel) => handleSiblingOption(rel)
  }
  let chooseParentsProps = {
    relationship: 'parents',
    people: [...people],
    updateRelatives: (action) => updateRelatives(action),
    handleRelativeOption: (rel) => handleParentsOption(rel)
  }
  let chooseChildrenProps = {
    relationship: 'children',
    people: [...people],
    updateRelatives: (action) => updateRelatives(action),
    handleRelativeOption: (rel) => handleChildrenOption(rel)
  }
  let chooseSpousesProps = {
    relationship: 'spouses',
    people: [...people],
    updateRelatives: (action) => updateRelatives(action),
    handleRelativeOption: (rel) => handleSpousesOption(rel)
  }
  let personDetailsProps = {...person, siblings, parents, children, spouses}
  
    // ui Sibling list
  const updateRelatives = (action) => {
    //setSiblings(tempSiblings)
     const sibsList = document.getElementById('sibs-list')
    // if (action === 'add') { 
    //   const found = tempSiblings.find(element => element.id === tempSibling.id )
    //   if (!found && tempSibling) {
    //   tempSiblings.push(tempSibling) 
    //   }
    // } else {
    //   const filtered = tempSiblings.filter(sib => sib.id !== tempSibling.id)
    //   tempSiblings = filtered
    // }
    const formattedSibs = formatNameList(siblings)
    
  }

  const handleSiblingOption = (rel) => {
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setSiblings(tempRelatives)
  }

  const handleParentsOption = (rel) => {
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setParents(tempRelatives)
  }
  
  const handleChildrenOption = (rel) => {
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setChildren(tempRelatives)
  }
    
  const handleSpousesOption = (rel) => {
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setSpouses(tempRelatives)
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
        updateARelative(siblings[i].name, personId, name, 'siblings', 'add')
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
         <PersonDetails {...personDetailsProps} />
         
        <form onSubmit={handleSubmit}>
          <ChooseRelatives {...chooseSiblingProps} />
          <ChooseRelatives {...chooseParentsProps} />    
          <ChooseRelatives {...chooseChildrenProps} /> 
          <ChooseRelatives {...chooseSpousesProps} /> 
          <button className="btn">Add Relatives</button>
      </form>
    </div>
  )
}
export { AddRelatives as default}
