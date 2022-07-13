// fetch comments from the comment firebase db which contain 
// the personId parameter
// called by <PersonSummary /> to obtain comments prior to deleting a person

import { dbFirestore } from "../firebase/config"
import { query, collection, where, getDocs } from 'firebase/firestore'

async function fetchComments(personId) {
    let commentsFound = []
    let ref = collection(dbFirestore, 'comments')
    let q = query(ref, where('personId', '==', personId))  
    try {
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => { 
           commentsFound.push({ commentId: doc.id, commentData: doc.data()})
        })
        return commentsFound
    } catch(err){
        console.log('error fetching comments', err)
        return err
    }
   
}

export {fetchComments as default}