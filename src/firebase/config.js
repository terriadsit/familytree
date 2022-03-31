import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAJDGT8620eCev8xvBPHjVQqN7RwqSVTBA",
    authDomain: "family-tree-434ad.firebaseapp.com",
    projectId: "family-tree-434ad",
    storageBucket: "family-tree-434ad.appspot.com",
    messagingSenderId: "214645809497",
    appId: "1:214645809497:web:e0c39f6b6456479fd4ec48"
  };

  // init firebase
  initializeApp(firebaseConfig)

  // init firestore
  const dbFirestore = getFirestore()

  // init firebase auth
  const auth = getAuth()

  export { dbFirestore, auth }
