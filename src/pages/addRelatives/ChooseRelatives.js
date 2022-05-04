import { useCollection } from "../../hooks/useCollection"
import formatNameList from "../../sharedFunctions/formatNameList"
import Select from 'react-select'

import { useState } from "react"

export default function ChooseRelatives({...props}) {
    const relationship = props.relationship
    const people = props.people
      
  return (
    <div>
      <label>
        <span>choose {relationship}</span>
          <Select className="relative"
            isMulti
            onChange={(option) => {props.handleRelativeOption(option)}}
            options={people}
          />
      </label>
    </div>
  )
}
