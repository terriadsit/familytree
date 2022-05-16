// return a bit of html for each person on the <Home /> page

export default function PersonSnippet({...personInfo}) {
  let tempBirthday = 'unknown'
  let tempBirthCity = 'unknown'
  let tempImageUrl = null
  const person = { ...personInfo.personInfo }
  let id = person.id
  const newUrl = `/person/${id}`
  console.log('snippet', person)


  return (
    <div>
      
        {person.name}
        {newUrl}
    </div>
  )
}
