// checks if images and pdf files are acceptable in size and type
// called from <AddPerson > and <PersonComments >

export default function checkFile(type, selected) {
    let error = null
    if (selected) {
      if (type === 'image') {
        if (!selected.type.includes('image')) {
          error = 'selected file must be an image'
        }
      } else {
          if (!selected.type.includes('pdf')) {
          error = 'selected file must be a pdf, the free app, AdobeScan can save files as .pdf'
          }
          if (selected.size > 100000) {
            error = 'selected pdf file must be smaller than 100kb, see FAQ page'
          }
      }
    }
        return error
}
