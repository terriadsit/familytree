// called by <App /> by useEffect hook to manage the displayName in the 
// sidebar. Importing it rather than leaving it in <App /> keeps
// useEffect warning at bay

function updateDisplayName(newName, setSbDisplayName) {
    console.log('inupdateDisplaName')
    setSbDisplayName(newName)
    console.log('aftersetSbDisplayname')
}

export { updateDisplayName as default }