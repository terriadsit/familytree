// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import getNewAuth from '../../src/sharedFunctions/getNewAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../src/firebase/config'

const fbConfig = {
    // Your config from Firebase Console
        apiKey: "AIzaSyAJDGT8620eCev8xvBPHjVQqN7RwqSVTBA",
        authDomain: "family-tree-434ad.firebaseapp.com",
        projectId: "family-tree-434ad",
        storageBucket: "family-tree-434ad.appspot.com",
        messagingSenderId: "214645809497",
        appId: "1:214645809497:web:e0c39f6b6456479fd4ec48"
      
};


firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });

const newLocal = 'uiLogin';
Cypress.Commands.add(newLocal, (email, password) => {
    cy.visit('/login')
    cy.get("[type='email']").type(email)
    cy.get("input#password").type(password)
    cy.get('[cy-test-id=loginBtn]').click()
})

Cypress.Commands.add('checkSignupBtn', (type) => {
  // type should be signUp or update
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${type}**`
    cy.intercept('POST', url).as('signup')
    cy.get('[cy-test-id=submit-form]').click()
    cy.wait('@signup')
      .its('response.statusCode')
      .should('eq', 200)
    // popup appears
    cy.findByText(/A verification email has been/, { timeout: 3000 }).should('be.visible')
    // page redirects
    cy.url().should('contain','login')
})

Cypress.Commands.add('deleteThisUser', (email, password) => {
  let user
  function handleError(error) {
    console.log('an error deleteing occurred', error)
  }

  signInWithEmailAndPassword(auth, email, password) 
   .then(() => {
        
        const user = auth.currentUser;
        console.log('before delete', user)
        
        deleteUser(user)
    })
    .then((res) => {
      // User deleted.
      console.log('user deleted', res)
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
     }
     handleError(error);
  });
  
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands'

