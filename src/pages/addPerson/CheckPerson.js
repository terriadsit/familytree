// called by <AddPerson /> to display possible duplicates to user

import { useCollection } from "../../hooks/useCollection";

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
 
  const { documents, error } = useCollection('people', null, null)

  const findMatches = (names, documents) => {
    let otherName = ''
    const allNames = documents.map(p => {
        otherName = p.otherName
        const nameToAdd = otherName ? `${p.name}, (${otherName})` : p.name
        const nameAndId = { name: nameToAdd, id: p.id}
        return nameAndId
    })
    for (let i=0; i < formattedNames.length; i++) {
        for (let j=0; j < allNames.length; j++) {
            let lowerCase = allNames[j].name.toLowerCase()
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
    <div cy-test-id="duplicate-names">
        {possibleMatches.length > 0 && <h4 cy-test-id="duplicate-heading">Are any of the following duplicates? Please do not add duplicates.</h4>}
        <ul>
            {possibleMatches.map(n => {
                return <li key={n.id} cy-test-id="name">{n.name}</li>
            })}
        </ul>
    </div>
  )
}
