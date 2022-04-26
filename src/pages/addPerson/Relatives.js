import { useCollection } from "../../hooks/useCollection"
import { useState, useEffect } from "react"
import Select from 'react-select'

export default function Relatives(person) {
  // form fields
  const [spouses, setSpouses] = useState([])
  const [marriageComments, setMarriageComments] = useState('')
  const [siblings, setSiblings] = useState([])
  const [parents, setParents] = useState([])
  const [children, setChildren] = useState([])
  
  // 'people' to populate drop down selects
  const { documents } = useCollection('people', null, null)
  const [people, setPeople] = useState([])
 
  const formatRelatives = (relatives) => {
     const rels = relatives.map(r =>  {
      return { id: r.value, name: r.label }
    })
    return rels
  }
 
  const handleSiblingOption = (sib) => {
      const sibs = formatRelatives(sib)
      setSiblings(sibs)
  }

  const handleParentOption = (parent) => {
    const parents = formatRelatives(parent)
    setParents(parents)
  }

  const handleChildrenOption = (child) => {
    const children = formatRelatives(child)
    setChildren(children)
  }
  
  const handleSpousesOption = (spouse) => {
    const s = formatRelatives(spouse)
    setSpouses(s)
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
            <Select 
              isMulti
              onChange={(option) => {handleSiblingOption(option)}}
              options={people}
          />
          </label>
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
