

export default function PersonSummary({ person }) {
    

    const formatNameList = (list) => {
        let tempList = ''
        for (let i=0; i < list.length; i++) {
            tempList += list[i].name + ', '
        }
        tempList = tempList.replace(/,\s*$/,"")
        return tempList
    }
    const parents = formatNameList(person.parents)
    const siblings = formatNameList(person.siblings)
    const spouses = formatNameList(person.spouses)
    const children = formatNameList(person.children)
    
  return (
    <div>
        <div className="person-summary">
        {person.imageUrl && 
                <img 
                    className="image"
                    src={person.imageUrl} 
                    alt="person" 
                 />}
            <br></br>
            <h2 className="page-title">{person.name} 
              {person.otherName && <span> ({person.otherName})</span>}
            </h2>
          
            <p>born: {person.birthDate ? person.birthDate : 'unknown'} to {person.deathDate ? person.deathDate : 'unknown'}</p>
            <p>at: {person.birthCity ? person.birthCity : 'unknown'}</p>
            <p>parents: {parents}</p>
            <p>sibling(s): {siblings}</p>
            <p>married to: {spouses} {person.marriageComments}</p>
            <p>children: {children}</p>
            <div>{person.comments}</div>
            <p className="created-by">Entry created by: {person.createdBy.createdByName} </p>
        </div>
    </div>
  )
}
