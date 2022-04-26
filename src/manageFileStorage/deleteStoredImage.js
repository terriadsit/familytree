import { getStorage, ref, deleteObject } from "firebase/storage";

export default function deleteStoredImage(url) {
  const storage = getStorage();

  // Create a reference to the file to delete
  const imageRef = ref(storage, url);

  // Delete the file
  deleteObject(imageRef).then(() => {
    // File deleted successfully
    return ''
  }).catch((error) => {
    // Uh-oh, an error occurred!
    return 'error deleting stored photo'
  })
}