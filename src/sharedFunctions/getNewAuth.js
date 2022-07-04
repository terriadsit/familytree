// for when firebase requires a new token
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default async function getNewAuth(user, email, password, handleError) {
    console.log('in get new auth', password)
    try {const credential = EmailAuthProvider.credential(
      email,
      password
    )
    await reauthenticateWithCredential(
      user, 
      credential
    )} catch (err) { 
    handleError(err)
  }
}