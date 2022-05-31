import deleteStoredImage from "../../manageFileStorage/deleteStoredImage"
import { dbFirestore } from "../../firebase/config"
import { deleteDoc, doc, collection } from "firebase/firestore"


async function deleteComment(comment, user, person) {
  
  // comment is an object { commentId, commentData }
    let deleteError = ''
    const createdById = comment.commentData.createdBy.createdBy
    // check if the user is the creator of the comment or the person
    if (user.uid === createdById || user.uid === person.createdBy.uid) {
      if (comment.commentData.imageUrl) {
        deleteError = deleteStoredImage(comment.commentData.imageUrl)
      }
      if (!deleteError) {
        // collection ref
        const ref = collection(dbFirestore, 'comments')
        try {
          await deleteDoc(doc(ref, comment.commentId ))
        }
        catch (err) {
          deleteError = err.message
        }
      }
    } else {
      alert('Only the creator of this comment or person may delete this comment.')
    } 
    return deleteError
}
export { deleteComment as default }