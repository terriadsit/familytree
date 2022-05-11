// upload a file (image or pdf) to FireStore
// called from <PersonComments > or <AddPerson >

import { storage } from "../firebase/config"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { dbFirestore } from "../firebase/config"
import { updateDoc, doc } from "firebase/firestore"

export async function uploadFile(type, file, personId, commentId) {
    let fileUrl = ''
    if (file) {
      try {
        // create path, commentId and personId are equal on main person entry
        const uploadPath = `files/${personId}/${commentId}/${file.name}`
        const storageRef = ref(storage, uploadPath)
        await uploadBytes(storageRef, file)
        fileUrl = await getDownloadURL(storageRef)

        // update person or comment doc to include fileUrl
        // person db only has an image, no pdf is allowed here
        if (personId === commentId) {
          const personRef = doc(dbFirestore, 'people', personId)
          updateDoc(personRef, { imageUrl: fileUrl })
        }  else {
          // comments can include pdf or image
          const commentRef = doc(dbFirestore, 'comments', commentId)
          if (type === 'image') {
            updateDoc(commentRef, { imageUrl: fileUrl })
          } else {
            updateDoc(commentRef, { pdfUrl: fileUrl })
            console.log('file url', fileUrl)
          }        
        }   
      } catch(err) { 
            console.log('could not upload image', err)
      }
    }    
    return fileUrl
}