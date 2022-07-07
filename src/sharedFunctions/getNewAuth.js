// for when firebase requires a new token
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default async function getNewAuth(user, email, password, handleError) {
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