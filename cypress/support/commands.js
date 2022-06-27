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
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';



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

