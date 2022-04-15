import { useEffect, useState, useRef } from "react"

// firebase imports 
import { dbFirestore } from "../firebase/config"
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export const useCollection = (whCollection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  // _query contains: field name, comparison, value to be == or !=
  let queryArray = useRef(_query).current
  let order = useRef(_orderBy).current

  // default order
  order = order ? order : ['name'] 
  
  useEffect(() => {
    let ref = collection(dbFirestore, whCollection)
    let q = (_query) ? 
      query(ref, where(...queryArray), orderBy(...order)) : 
      query(ref, orderBy(...order) )
    
    const unsubscribe = onSnapshot(q, snapshot => {
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

  }, [whCollection, _query, order, queryArray])

  return { documents, error }
}