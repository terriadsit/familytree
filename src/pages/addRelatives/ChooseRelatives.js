import { useCollection } from "../../hooks/useCollection"
import formatNameList from "../../sharedFunctions/formatNameList"
import Select from 'react-select'

import { useState } from "react"

export default function ChooseRelatives({...props}) {
    const relationship = props.relationship
    const people = props.people
    console.log('relationship', props)
      
  return (
    <div>
          <label>
            <span>choose siblings</span>
            <Select className="sibling"
              onChange={(option) => {props.handleSiblingOption(option)}}
              options={people}
            />
          </label>
         <button type="button" className="btn" onClick={() => props.updateRelatives('add')}>Add Sibling</button>
          <button type="button" className="btn" onClick={() => props.updateRelatives('remove')}>Remove Sibling</button>
          
    </div>
  )
}
