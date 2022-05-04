import { useEffect, useState } from "react"
import { dbFirestore } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"

export const useDocument = (collection, id) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // realtime document data
  useEffect(() => {
    const ref = doc(dbFirestore, collection, id)

    const unsubscribe = onSnapshot(ref, snapshot => {
      // need to make sure the doc exists & has data
      if(snapshot.data()) {
        setData({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, err => {
      console.log(err.message)
      setError('failed to get document')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, id])

  return { data, error }
}