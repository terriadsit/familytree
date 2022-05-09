// manage adding and updating (remove or add) relatives, 
// called by <AddPerson>
// holds state for relatives wh/ is updated through props functions managed here

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useCollection } from "../../hooks/useCollection"
import { useDocument } from "../../hooks/useDocument"
import updateARelative from "../../manageFileStorage/updateARelative"
import PersonDetails from "../../components/PersonDetails"
import ChooseRelatives from './ChooseRelatives'

// styles
import './AddRelatives.css'
import RemoveRelatives from './RemoveRelatives'

function AddRelatives() {
  
  const navigate = useNavigate()

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

  // check for select field relatives matching existing relatives
  const checkForMatch = (prevRel, proposedRel) => {
   let found = null
    proposedRel.map(r => {
      found = prevRel.find(el => el.id === r.value) 
      if (!found) {
        prevRel.push({id: r.value, name: r.label})
      }
      return null
    })
    return prevRel
  }
  
  // on update of person, add previous relatives to state
  // passed as props to RemoveRelative component
  const addPrevRelatives =  (rel, relationship) => {
    let tempRelatives = []
    rel.map((r) => tempRelatives.push({id: r.id, name: r.name}))
    switch (relationship) {
      case 'siblings':
        setSiblings(tempRelatives)
        break;
      case 'parents':
        setParents(tempRelatives)
        break;
      case 'spouses':
        setSpouses(tempRelatives)
        break;
      case 'children':
        setChildren(tempRelatives)
        break;
      default:
        console.log('no such relative')
    }
  }
  
  // set up props for components, first removing then adding
  let removeSiblingProps = {
    relationship: 'siblings',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (e) => removeSibling(e)
  }
  let removeParentProps = {
    relationship: 'parents',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (e) => removeParents(e)
  }
  let removeSpouseProps = {
    relationship: 'spouses',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (e) => removeSpouses(e)
  }
  let removeChildrenProps = {
    relationship: 'children',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (e) => removeChildren(e)
  }
  let chooseSiblingProps = {
    relationship: 'sibling',
    people: [...people],
    handleRelativeOption: (rel) => handleSiblingOption(rel)
  }
  let chooseParentsProps = {
    relationship: 'parents',
    people: [...people],
    handleRelativeOption: (rel) => handleParentsOption(rel)
  }
  let chooseChildrenProps = {
    relationship: 'children',
    people: [...people],
    handleRelativeOption: (rel) => handleChildrenOption(rel)
  }
  let chooseSpousesProps = {
    relationship: 'spouses',
    people: [...people],
    handleRelativeOption: (rel) => handleSpousesOption(rel)
  }
  let personDetailsProps = {...person, siblings, parents, children, spouses}
  
  // formfield onClick delete functions passed to <RemoveRelatives>
  // remove relative from db
  // remove relative from state to keep ui in sync
  const removeSibling = (e) => {
    let tempRelatives = [...siblings]
    // remove sibling to this person in db, then remove this person from sibs as a sib
    updateARelative(personId, e.target.value, e.target.name, 'siblings', 'remove')
    updateARelative(e.target.value, personId, name, 'siblings', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== e.target.value)
    setSiblings(keepRelatives)
  }
  const removeParents = (e) => {
    let tempRelatives = [...parents]
    // remove parent to this person in db, then remove this person from parent as a child
    updateARelative(personId, e.target.value, e.target.name, 'parents', 'remove')
    updateARelative(e.target.value, personId, name, 'children', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== e.target.value)
    setParents(keepRelatives)
  }
  const removeChildren = (e) => {
    let tempRelatives = [...children]
    // remove child of this person in db, then remove this person as a parent to the child
    updateARelative(personId, e.target.value, e.target.name, 'children', 'remove')
    updateARelative(e.target.value, personId, name, 'parents', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== e.target.value)
    setChildren(keepRelatives)
  }
  const removeSpouses = (e) => {
    let tempRelatives = [...spouses]
    // remove spouse to this person in db, then remove this person from the spouse as a spouse
    updateARelative(personId, e.target.value, e.target.name, 'spouses', 'remove')
    updateARelative(e.target.value, personId, name, 'spouses', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== e.target.value)
    setSpouses(keepRelatives)
  }

  // formfield onChange functions, passed to <ChooseRelative>
  // add unique chosen relatives from select field to state
  const handleSiblingOption = (rel) => {
    let tempRelatives = [...siblings]
    tempRelatives = checkForMatch(tempRelatives, rel)
    setSiblings(tempRelatives)
  }
  
  const handleParentsOption = (rel) => {
    let tempRelatives = [...parents]
    tempRelatives = checkForMatch(tempRelatives, rel)
    setParents(tempRelatives)
  }
  const handleChildrenOption = (rel) => {
    let tempRelatives = [...children]
    tempRelatives = checkForMatch(tempRelatives, rel)
    setChildren(tempRelatives)
  }
  const handleSpousesOption = (rel) => {
    let tempRelatives = [...spouses]
    tempRelatives = checkForMatch(tempRelatives, rel)
    setSpouses(tempRelatives)
  }
    
  const handleSubmit = (e) => {
      e.preventDefault()
      // note: updateARelative parameters are:
      // (personToUpdateId, relativeId, relativeName, whRelative, whChange)
      
      // add sibs to this person in db, then add this person to sibs as a sib
      for (let i = 0; i < siblings.length; i++) {
        updateARelative(personId, siblings[i].id, siblings[i].name, 'siblings', 'add')
        updateARelative(siblings[i].id, personId, name, 'siblings', 'add')
      }
      
      // update parents of this person, then add this person as a child to them
      for (let i = 0; i < parents.length; i++) {
        updateARelative(personId, parents[i].id, parents[i].name, 'parents', 'add')
        updateARelative(parents[i].id, personId, name, 'children', 'add')
      }

      // update children of this person, then add this person as parent to them
      for (let i = 0; i < children.length; i++) {
        updateARelative(personId, children[i].id, children[i].name, 'children', 'add')
        updateARelative(children[i].id, personId, name, 'parents', 'add')
      }

      // update any spouse(s)
     for (let i = 0; i < spouses.length; i++) {
       updateARelative(personId, spouses[i].id, spouses[i].name, 'spouses', 'add')
       updateARelative(spouses[i].id, personId, name, 'spouses', 'add')
     }

      // navigate home
      navigate('/')
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
          {person && <RemoveRelatives {...removeSiblingProps} />}
          <ChooseRelatives {...chooseSiblingProps} />
          {person && <RemoveRelatives {...removeParentProps} />}
          <ChooseRelatives {...chooseParentsProps} /> 
          {person && <RemoveRelatives {...removeChildrenProps} />}   
          <ChooseRelatives {...chooseChildrenProps} /> 
          {person && <RemoveRelatives {...removeSpouseProps} />}
          <ChooseRelatives {...chooseSpousesProps} /> 
          <button className="btn">Add Relatives</button>
      </form>
    </div>
  )
}
export { AddRelatives as default}
