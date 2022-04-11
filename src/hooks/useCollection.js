import { useEffect, useState, useRef } from "react"

// firebase imports 
import { dbFirestore } from "../firebase/config"
import { collection, query, where, onSnapshot } from 'firebase/firestore'

export const useCollection = (whCollection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  let queryArray = useRef(_query).current
  const orderBy = useRef(_orderBy).current

  useEffect(() => {
    let ref = collection(dbFirestore, whCollection)
    if (orderBy) {
      ref = ref.orderBy(...orderBy)
    }

    const unsubscribe = onSnapshot(ref, snapshot => {
      let results = []
      
      snapshot.docs.forEach(doc => {
        
        results.push({...doc.data(), id: doc.id})
      });
      
      // update state
      setDocuments(results)
      setError(null)
    }, error => {
      console.log(error)
      setError('could not fetch the data')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [whCollection, query, orderBy])

  return { documents, error }
}