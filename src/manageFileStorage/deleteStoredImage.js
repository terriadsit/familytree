// delete a file from firebase storage when passed an url to that file
// called by <AddPerson />, deleteComment.js, </PersonSummar />

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