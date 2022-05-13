// return a bit of html for each person on the <Home /> page

export default function PersonSnippet({...personInfo}) {
  let tempBirthday = 'unknown'
  let tempBirthCity = 'unknown'
  let tempImageUrl = null
  let id = personInfo.personId
  const newUrl = `/person/${id}`
  console.log('snippet', personInfo)

  return (
    <div>
      
        {personInfo.personInfo.name}
    </div>
  )
}
