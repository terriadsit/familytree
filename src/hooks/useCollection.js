// obtain documents from the firebase firestore db
// parameters for which collection of files, query criteria and  
// order to retrieve, default order is by name field 
// NOTE!! if selected db has no name field, an error will occur if 
// no order is submitted on call
import { useEffect, useState, useRef } from "react"
import myLogger from "../sharedFunctions/myLogger"

// firebase imports 
import { dbFirestore } from "../firebase/config"
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export const useCollection = (whCollection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  console.log('in useCollection')
  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  // _query contains: field name, comparison, value to be == or !=
  let order = _orderBy
  let queryArray = useRef(_query).current
  
  
  // default order
  order = order ? order : 'name'
  
  useEffect(() => {
    let ref = collection(dbFirestore, whCollection)
    let q = (queryArray) ? 
      query(ref, where(...queryArray), orderBy(order)) : 
      query(ref, orderBy(order) )
    console.log('in useCollection useEffect')
    const unsubscribe = onSnapshot(q, snapshot => {
      let results = []
      
      snapshot.docs.forEach(doc => {
        
        results.push({...doc.data(), id: doc.id})
      });
      
      // update state
      setDocuments(results)
      setError(null)
    }, error => {
      myLogger(error)
      //setError('could not fetch the data')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [whCollection, queryArray, order])

  return { documents, error }
}