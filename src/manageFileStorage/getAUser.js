import { doc, getDoc } from 'firebase/firestore'
import { dbFirestore } from '../firebase/config'

async function getAUser (uid) {
     
    let userDetails
  try {
    const ref = doc(dbFirestore, 'users', uid)

    const docSnap = await getDoc(ref)

    if (docSnap.exists()) {
      userDetails = { ...docSnap.data() }
    }

    return userDetails
  } catch (err) {
    
    console.log('error', err)
  }
}

export { getAUser as default }
