import { storage } from "../firebase/config"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { dbFirestore } from "../firebase/config"
import { updateDoc, doc } from "firebase/firestore"

export async function uploadImage(image, personId, commentId) {
    let imgUrl = ''
    if (image) {
      try {
        // create path, commentId and personId are equal on main person entry
        const uploadPath = `images/${personId}/${commentId}/${image.name}`
        const storageRef = ref(storage, uploadPath)
        await uploadBytes(storageRef, image)
        imgUrl = await getDownloadURL(storageRef)

        // update person or comment doc to include imageUrl
        const personRef = doc(dbFirestore, 'people', personId)
        updateDoc(personRef, { imageUrl: imgUrl })

         } catch(err) { 
            console.log('could not upload image', err)
      }
    }    
    return imgUrl
}
