// get a document from firebase db using the collection 
// name and document id

import { useEffect, useState } from "react"
import { dbFirestore } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"
import myLogger from "../sharedFunctions/myLogger"

export const useDocument = (collection, id) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // realtime document data
  useEffect(() => {
    const ref = doc(dbFirestore, collection, id)

    const unsubscribe = onSnapshot(ref, snapshot => {
      // need to make sure the doc exists & has data
      if(snapshot.data()) {
        console.log('in useDocuments')
        setData({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, err => {
      myLogger(err.message)
      setError('failed to get document')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, id])

  return { data, error }
}