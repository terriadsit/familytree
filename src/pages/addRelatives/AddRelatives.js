import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useCollection } from "../../hooks/useCollection"
import { useDocument } from "../../hooks/useDocument"
import updateARelative from "../../manageFileStorage/updateARelative"
import PersonDetails from "../../components/PersonDetails"
import ChooseRelatives from './ChooseRelatives'

// styles
import './AddRelatives.css'

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

  let tempRelatives = []   
  
  // set up props for components
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
  
  // formfield onChange functions, passed to <ChooseRelative>
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
