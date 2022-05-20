import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'


// firebase imports 
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

import { dbFirestore } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, checked) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password)
      if (!res) {
        throw new Error('Could not complete signup')
      }

      // add display name to user
      await updateProfile(res.user, { displayName })

      // create a user document
      const uid =  res.user.uid
      const myPersons = []
      const userData = {
        displayName,
        email,
        shareEmail: checked,
        myPersons
      }
      await setDoc(doc(dbFirestore, 'users', uid), userData)
      
      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}