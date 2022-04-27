export default function formatNameList(list) {
    let tempList = ''
    for (let i=0; i < list.length; i++) {
        tempList += list[i].name + ', '
    }
    tempList = tempList.replace(/,\s*$/,"")
    return tempList
}
