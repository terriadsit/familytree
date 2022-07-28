// manage adding and updating (remove or add) relatives, 
// called by <AddPerson>
// holds state for relatives wh/ is updated through props functions managed here
// <ChooseRelatives /> from a react-select field
// <RemoveRelatives /> from previously added relatives
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useCollection } from "../../hooks/useCollection"
import { useDocument } from "../../hooks/useDocument"
import updateARelative from "../../manageFileStorage/updateARelative"
import myLogger from '../../sharedFunctions/myLogger'
import PersonDetails from "../../components/PersonDetails"
import ChooseRelatives from './ChooseRelatives'
import RemoveRelatives from './RemoveRelatives'
import { useAuthContext } from '../../hooks/useAuthContext'

// styles
//import './AddRelatives.css'

function AddRelatives() {
  
  const navigate = useNavigate()
  const { user } = useAuthContext()
  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
  
  // populate people for select
  useEffect(() => {
    if(documents) {
      const options = documents.map(person => {
        return { value: person.id, label: person.name }
    })
    setPeople(options)
    }
  },[documents])
 
      

  // person who is getting relatives added
  let params = useParams()
  const personId = params.id
  const { data: tempdoc, error } = useDocument('people', personId )
  const person = { ...tempdoc }
  const name = person.name   

  let personError = !person.name ? 'this person does not exist' : ''
  
  // form fields
  const [spouses, setSpouses] = useState([])
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
<<<<<<< HEAD
  console.log('in add relatives')
=======
  console.log('in AddRelatives')
>>>>>>> cd59788f8bebc44d2d9e3bf8edb99f3b8ecac495
  
  // check for prevRel relatives matching Proposed relatives
  // used to add from react select on updates
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
        myLogger('no such relative')
    }
  }
  
  // set up props for components, first removing then adding
  let removeSiblingProps = {
    relationship: 'siblings',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (id, name) => removeSibling(id, name)
  }
  let removeParentProps = {
    relationship: 'parents',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (id, name) => removeParents(id, name)
  }
  let removeSpouseProps = {
    relationship: 'spouses',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (id, name) => removeSpouses(id, name)
  }
  let removeChildrenProps = {
    relationship: 'children',
    person,
    addPrevRelatives: (rel, relationship) => addPrevRelatives(rel, relationship),
    removePrevRelative: (id, name) => removeChildren(id, name)
  }
  let chooseSiblingProps = {
    relationship: 'sibling',
    people: [...people],
    handleRelativeOption: (rel, action) => handleSiblingOption(rel, action)
  }
  let chooseParentsProps = {
    relationship: 'parents',
    people: [...people],
    handleRelativeOption: (rel, action) => handleParentsOption(rel, action)
  }
  let chooseChildrenProps = {
    relationship: 'children',
    people: [...people],
    handleRelativeOption: (rel, action) => handleChildrenOption(rel, action)
  }
  let chooseSpousesProps = {
    relationship: 'spouses',
    people: [...people],
    handleRelativeOption: (rel, action) => handleSpousesOption(rel, action)
  }
  let personDetailsProps = {...person, siblings, parents, children, spouses}
  
  // formfield onClick delete functions passed to <RemoveRelatives>
  // also called by handleRelativeOption functions to remove from react-select x
  // remove relative from state to keep ui in sync
  // updateARelative firestore db call does not cause an error if record is not found to remove via arrayRemove
  const removeSibling = (relId, relName) => {
    let tempRelatives = [...siblings]
    // remove sibling to this person in db, then remove this person from sibs as a sib
    updateARelative(personId, relId, relName, relName,'siblings', 'remove')
    updateARelative(relId, personId, name, name, 'siblings', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== relId)
    setSiblings(keepRelatives)
  }
  const removeParents = (relId, relName) => {
    let tempRelatives = [...parents]
    // remove parent to this person in db, then remove this person from parent as a child
    updateARelative(personId, relId, relName, relName,'parents', 'remove')
    updateARelative(relId, personId, name, name,'children', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== relId)
    setParents(keepRelatives)
  }
  const removeChildren = (relId, relName) => {
    let tempRelatives = [...children]
    // remove child of this person in db, then remove this person as a parent to the child
    updateARelative(personId, relId, relName, relName,'children', 'remove')
    updateARelative(relId, personId, name, name,'parents', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== relId)
    setChildren(keepRelatives)
  }
  const removeSpouses = (relId, relName) => {
    let tempRelatives = [...spouses]
    // remove spouse to this person in db, then remove this person from the spouse as a spouse
    updateARelative(personId, relId, relName, relName,'spouses', 'remove')
    updateARelative(relId, personId, name, name,'spouses', 'remove')
    const keepRelatives = tempRelatives.filter((r) => r.id !== relId)
    setSpouses(keepRelatives)
  }

  // formfield onChange functions, passed to <ChooseRelative>
  // add unique chosen relatives from select field to state
  // or if user x out, 'remove-value', remove the previous addition
  // via removeRelative
  // <ChooseRelative /> is a react-select field
  const handleSiblingOption = (rel, action) => {
    // if x out a value (remove-value) from react-select
    if (action.action === "remove-value") {
        removeSibling(action.removedValue.value, action.removedValue.label)
    } else {
      let tempRelatives = [...siblings]
      tempRelatives = checkForMatch(tempRelatives, rel)
      setSiblings(tempRelatives)
   }
  }
  const handleParentsOption = (rel, action) => {
    // if x out a value (remove-value) from react-select
    if (action.action === "remove-value") {
      removeParents(action.removedValue.value, action.removedValue.label)
    } else {
      let tempRelatives = [...parents]
      tempRelatives = checkForMatch(tempRelatives, rel)
      setParents(tempRelatives)
    }
  }
  const handleChildrenOption = (rel, action) => {
    // if x out a value (remove-value) from react-select
    if (action.action === "remove-value") {
      removeChildren(action.removedValue.value, action.removedValue.label)
    } else {
      let tempRelatives = [...children]
      tempRelatives = checkForMatch(tempRelatives, rel)
      setChildren(tempRelatives)
    }
  }
  const handleSpousesOption = (rel, action) => {
    // if x out a value (remove-value) from react-select
    if (action.action === "remove-value") {
      removeSpouses(action.removedValue.value, action.removedValue.label)
    } else {
      let tempRelatives = [...spouses]
      tempRelatives = checkForMatch(tempRelatives, rel)
      setSpouses(tempRelatives)
    }
  }
    
  const handleSubmit = (e) => {
      e.preventDefault()
      // note: updateARelative parameters are:
      // (personToUpdateId, relativeId, relativeName, whRelative, whChange)
      
      // add sibs to this person in db, then add this person to sibs as a sib
      for (let i = 0; i < siblings.length; i++) {
        updateARelative(personId, siblings[i].id, siblings[i].name, siblings[i].name,'siblings', 'add')
        updateARelative(siblings[i].id, personId, name, name,'siblings', 'add')
      }
      
      // update parents of this person, then add this person as a child to them
      for (let i = 0; i < parents.length; i++) {
        updateARelative(personId, parents[i].id, parents[i].name, parents[i].name,'parents', 'add')
        updateARelative(parents[i].id, personId, name, name,'children', 'add')
      }

      // update children of this person, then add this person as parent to them
      for (let i = 0; i < children.length; i++) {
        updateARelative(personId, children[i].id, children[i].name, children[i].name,'children', 'add')
        updateARelative(children[i].id, personId, name, name,'parents', 'add')
      }

      // update any spouse(s)
     for (let i = 0; i < spouses.length; i++) {
       updateARelative(personId, spouses[i].id, spouses[i].name, spouses[i].name,'spouses', 'add')
       updateARelative(spouses[i].id, personId, name, name,'spouses', 'add')
     }

      // navigate home
      navigate('/')
    }
  
    if (!person) {
      return <div className="loading">Loading...</div>
    } 
    
    if (error) {
      return <div className="error">{error}</div>
    }

    if (personError) {
      return <div className="personError">Looking for person...</div>
    }

    if (user.uid !== person.createdBy.uid) {
      return <div className="error">only the creator of this entry for {person.name} may add relatives</div>
    }
    return (
      <div>
         <PersonDetails {...personDetailsProps} />
         
         <p>Relatives must first be added with the "Add a Person" link
          before they are available to choose in the select drop downs. 
        </p>
        <p>The select drop downs may be typed in to find a choice.</p>
        <br></br>
        <form cy-test-id="relative-form" onSubmit={handleSubmit}>
          {person.siblings.length > 0 && <RemoveRelatives {...removeSiblingProps} />}
          <ChooseRelatives {...chooseSiblingProps} />
          {person.parents.length > 0 && <RemoveRelatives {...removeParentProps} />}
          <ChooseRelatives {...chooseParentsProps} /> 
          {person.children.length > 0 && <RemoveRelatives {...removeChildrenProps} />}   
          <ChooseRelatives {...chooseChildrenProps} /> 
          {person.spouses.length > 0 && <RemoveRelatives {...removeSpouseProps} />}
          <ChooseRelatives {...chooseSpousesProps} /> 
          <button cy-test-id="add-relatives-btn" className="btn">Save Changes</button>
        </form>
    </div>
  )
}
export { AddRelatives as default}
