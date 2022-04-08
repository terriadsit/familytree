import { dbFirestore } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"

export default function getPersonFromId(id) {
    let person = {}
    const ref = doc(dbFirestore, 'people', 'lbtJ6HZwwIUBAdafPCrS')

    onSnapshot(ref, snapshot => {
      // need to make sure the doc exists & has data
      if(snapshot.data()) {
        person = {...snapshot.data(), id: snapshot.id}
        console.log('snapshot data', person)
      } else {
        console.log('no such person id', id)      
      }
    })
         
   return { person }
} 

