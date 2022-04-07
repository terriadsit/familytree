import { storage } from "../firebase/config"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export async function uploadImage(image, personId, commentId) {
    let imgUrl = ''

    try {
    // create user thumbnail, commentId and personId are equal on main person entry
    const uploadPath = `images/${personId}/${commentId}/${image.name}`
    const storageRef = ref(storage, uploadPath)
    await uploadBytes(storageRef, image)
    imgUrl = await getDownloadURL(storageRef)
    } catch(err) { 
        console.log('could not upload image', err)
    }
        
    return imgUrl
}
