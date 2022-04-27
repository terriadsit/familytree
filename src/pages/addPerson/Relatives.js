import { useCollection } from "../../hooks/useCollection"
import { useState, useEffect } from "react"
import Select from 'react-select'
import formatNameList from "../../sharedFunctions/formatNameList"

export default function Relatives(person) {
  // form fields
  const [spouses, setSpouses] = useState([])
  const [marriageComments, setMarriageComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])

  const sibsList = document.getElementById('sibs-list')

  let tempSibling = ''
  let tempSiblings = []
  const seen = new Set()
  let siblingSet = new Set()
  
  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
   
  const updateSiblings = (action) => {
    console.log('action', action, 'tempsib', tempSibling)
    if (action === 'add') { 
      
        const found = tempSiblings.find(element => element.id === tempSibling.id )
        if (!found && tempSibling) {
          tempSiblings.push(tempSibling) 
        }
    } else {
        const filtered = tempSiblings.filter(sib => sib.id !== tempSibling.id)
        tempSiblings = filtered
        console.log('must add or remove sibling')
    }
    console.log('tempsibs',tempSiblings)
    const formattedSibs = formatNameList(tempSiblings)
    sibsList.innerText = 'current siblings: ' + formattedSibs
  }

  const addSibling = () => {
    const found = tempSiblings.find(element => element.id === tempSibling.id )
    if (!found && tempSibling) {
      tempSiblings.push(tempSibling)
      const formattedSibs = formatNameList(tempSiblings)
      sibsList.innerText = 'current siblings: ' + formattedSibs
    }
  }

  const removeSibling = () => {
    console.log('remove', tempSibling)
    const filtered = tempSiblings.filter(sib => sib.id !== tempSibling.id)
    console.log('filtered', filtered)
    tempSiblings = filtered
    const formattedSibs = formatNameList(tempSiblings)
    sibsList.innerText = 'current siblings: ' + formattedSibs
  }
 
  const handleSiblingOption = (sib) => {
    tempSibling = { id: sib.value, name: sib.label }
  }

  const handleParentOption = (parent) => {
    //const parents = formatRelatives(parent)
    setParents(parents)
  }

  const handleChildrenOption = (child) => {
    //const children = formatRelatives(child)
    setChildren(children)
  }
  
  const handleSpousesOption = (spouse) => {
    //const s = formatRelatives(spouse)
    setSpouses(spouse)
  }

  // populate people for select
  useEffect(() => {
    if(documents) {
      const options = documents.map(person => {
        return { value: person.id, label: person.name }
      })
      setPeople(options)
    }

   },[documents])

  return (
    <div>
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
    </div>
  )
}
