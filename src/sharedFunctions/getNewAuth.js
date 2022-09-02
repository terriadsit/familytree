// Used when Firebase requires a new token prior to updating
// email and password.
// Called by <Signup /> when updating a user profile.

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