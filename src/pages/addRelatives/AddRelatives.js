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
  const [prevSiblings, setPrevSiblings] = useState([])

  // on updates, add previous relatives to state
  // passed as props to RemoveRelative component
  const addPrevRelatives =  (rel) => {
    let tempRelatives = []
    console.log('rel', rel)
    rel.map((r) => tempRelatives.push({id: r.id, name: r.name}))
    console.log('temprelatives', tempRelatives )
    setSiblings(tempRelatives)
  }
  
  // set up props for components
  let removeSiblingProps = {
    relationship: 'siblings',
    prevRelatives: person,
    addPrevRelatives: (rel) => addPrevRelatives(rel),
    removePrevRelative: (e) => removeSibling(e)
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
  
  // formfield onClick functions passed to <RemoveRelatives>
  const removeSibling = (e) => {
    let tempRelatives = [...siblings]
    // remove sibling to this person in db, then remove this person from sibs as a sib
    updateARelative(personId, e.target.value, e.target.name, 'siblings', 'remove')
    updateARelative(e.target.value, personId, name, 'siblings', 'remove')
    console.log('sibling to remove', e.target.value, e.target.name)
    const keepRelatives = tempRelatives.filter((r) => r.id !== e.target.value)
    setSiblings(keepRelatives)
  }

  // formfield onChange functions, passed to <ChooseRelative>
  const handleSiblingOption = (rel) => {
    let tempRelatives = [...siblings]
    let found = null
    console.log('rel', rel)
    rel.map(r => {
      found = tempRelatives.find(el => el.id === r.value) 
      console.log('ids', r.id )
      if (!found) {
        tempRelatives.push({id: r.value, name: r.label})
      }
      return null
    })

  
    //rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setSiblings(tempRelatives)
    console.log('handle sib tempRelatives',tempRelatives)
  }
  
  const handleParentsOption = (rel) => {
    let tempRelatives = []
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setParents(tempRelatives)
  }
  const handleChildrenOption = (rel) => {
    let tempRelatives = []
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
    setChildren(tempRelatives)
  }
  const handleSpousesOption = (rel) => {
    let tempRelatives = []
    rel.map((r) => tempRelatives.push({id: r.value, name: r.label}))
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
          <ChooseRelatives {...chooseParentsProps} />    
          <ChooseRelatives {...chooseChildrenProps} /> 
          <ChooseRelatives {...chooseSpousesProps} /> 
          <button className="btn">Add Relatives</button>
      </form>
    </div>
  )
}
export { AddRelatives as default}
