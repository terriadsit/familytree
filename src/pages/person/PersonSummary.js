
export default function PersonSummary({ person }) {
    //const parents = person.parents

    const printNameList = (list) => {
        let tempList = ''
        for (let i=0; i < list.length; i++) {
            tempList += list[i].name + ', '
        }
        tempList = tempList.replace(/,\s*$/,"")
        return tempList
    }
    const parents = printNameList(person.parents)
    const siblings = printNameList(person.siblings)
    const spouses = printNameList(person.spouses)
    
  return (
    <div>
        <div className="project-summary">
            <h2 className="page-title">{person.name} ({person.otherName})</h2>
            <p>born: {person.birthDate ? person.birthDate : 'unknown'} to {person.deathDate ? person.deathDate : 'unknown'}</p>
            <p>at: {person.birthCity ? person.birthCity : 'unknown'}</p>
            <p>parents: {parents}</p>
            <p>sibling(s): {siblings}</p>
            <p>married to: {spouses}</p>
        </div>
    </div>
  )
}
