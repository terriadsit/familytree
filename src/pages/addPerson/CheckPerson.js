// called by <AddPerson /> to display possible duplicates to user

import { useCollection } from "../../hooks/useCollection";
import { useState, useEffect } from "react";

export default function CheckPerson(props) {
  // props.name is input from user in AddPerson name input field
  const name = props.name
  const names = name.trim().split(/\s+/);
  const formattedNames = names.map(n => {
    const noPeriod = n.replace('.', '')
    return noPeriod.toLowerCase()
  })
  // possible matches to display to user
  let possibleMatches = []
  // allNames in the firebease people db
  let allNames = []

  const { documents, error } = useCollection('people', null, null)

  const findMatches = (names, documents) => {
    let found = false
    let otherName = ''
    const allNames = documents.map(p => {
        otherName = p.otherName
        const nameToAdd = otherName ? `${p.name}, (${otherName})` : p.name
        return nameToAdd
    })
    for (let i=0; i < formattedNames.length; i++) {
        for (let j=0; j < allNames.length; j++) {
            let lowerCase = allNames[j].toLowerCase()
            let match = lowerCase.match(formattedNames[i])
            if (match) {
                possibleMatches.push(allNames[j])
            }
        }
    }
  }

  if(documents && !error) {
    findMatches(names, documents)
  }

  return (
    <div>
        {possibleMatches.length > 0 && <h4>Are any of the following duplicates? If so, please do not add again.</h4>}
        <ul>
            {possibleMatches.map(n => {
                return <li>{n}</li>
            })}
        </ul>
    </div>
  )
}
