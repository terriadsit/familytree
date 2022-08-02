/// <reference types="Cypress" />
import { auth } from '../../src/firebase/config'

describe('update user appears and operates correctly', () => {
   
  const random = Math.random().toString(36).substring(2) 
  const $displayName = Cypress.env('DISPLAY_NAME')
  const $password = Cypress.env('PASSWORD')
  const $email = Cypress.env('EMAIL') 
  const newEmail = `familyTree${random}@dispostable.com`
    
 function fillInEmailPassword(email, password) {
    cy.findByPlaceholderText('email').clear().type(email)
    cy.get('input#prevPassword').clear().type(password)
  }

  function enterNewPasswords(thePassword) {
    cy.get("[placeholder='password']").type(thePassword)
    cy.get("[placeholder='check password']").type(thePassword)
    
  }

  before(() => {
    cy.login()
  })
  
  beforeEach(() => {
    cy.visit('/updateuser')
    cy.wait(5000)
  })
  
  it('displays correct fields and buttons', () => {
    // done in Signup.cy.js except for current password field
    cy.get('input#prevPassword').should('have.attr', 'type', 'password')
  })

  it('displays current user information', () => {
    cy.wait(4000)
    // not sure why matchCase is not working
    //cy.get("[placeholder='email']").contains($email, { matchCase: false })
    
    // get current user name from sidebar
    cy.get(".user > p")
      .then(data => {
        const length = data.text().length
        const sidebarName = data.text().substring(8, length-1)
        cy.get("[placeholder='display name']").should('have.value', sidebarName)
      })
    
  })

  it('requires corrrect current password before submitting, else errors handled', () => {
    cy.once('uncaught:exception', () => false)
    cy.wait(15000)
    cy.visit('/updateuser')
    
    cy.wait(5000)
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts*').as('getAuth')
    cy.get('input#prevPassword').should('have.attr', 'required')
    cy.get('input#prevPassword').type('thisisincorrect')
    
    cy.get('[cy-test-id=submit-form]').click()
    cy.wait('@getAuth')
      .its('response.statusCode')
      .should('eq', 400)
  })
 
  it('does not allows user to change email address to nonemail type or in use email', () => {
    function wrongEmail(badEmail) {
      fillInEmailPassword($email,$password)
      cy.get("[placeholder='email']").clear().type(badEmail)
      cy.get('.auth-form > .btn').click()
    }
    cy.wait(5000)
    wrongEmail('bademailtype')
    cy.findByPlaceholderText('email').invoke('prop','validity')
       .should('deep.include', {
        typeMismatch: true
       })
    wrongEmail('familyTree4@dispostable.com')
    cy.findByText(/An error occurred/, { timeout: 5000 }).should('be.visible')
   })

  it.skip('allows user to change password', () => {
    cy.wait(5000)
    const newPassword = 'newPassword123'
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type($password)
    enterNewPasswords(newPassword)
    cy.get('.auth-form > .btn').click()
    cy.get("[href='\/updateuser']").click()
    cy.wait(10000)
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type(newPassword)
    enterNewPasswords($password)
    cy.get('.auth-form > .btn').click()
    
  })

  // just use if above test fails to reset password quickly
  it.skip('undo above test allows user to change password', () => {
    const newPassword = 'newPassword123'
    cy.wait(5000)
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type(newPassword)
    enterNewPasswords($password)
    cy.get('.auth-form > .btn').click()
    cy.wait(5000)
    cy.get("[cy-test-id=logoutBtn]").click()
  })
  
  // skip this unless you want to switch back primary email and reverify
  it.skip('allows user to change email address, then must be verified', () => {
    cy.wait(15000)
    cy.get("[placeholder='email']").clear().type(newEmail)
    cy.get('input#prevPassword').type($password)
    cy.checkSignupBtn('update')
    
  })
  
  it('displays error for invalid updated password', () => {
    cy.wait(5000)
    cy.get('input#prevPassword').type($password)
    enterNewPasswords('test')
    cy.get('.auth-form > .btn').click()
    cy.findByText(/An error occurred while updating./, { timeout: 3000}).should('be.visible')
  })

  
  it('allows user to change display name, is required, updates display name in sidebar', () => {
    const newName = `name${random}`

    function changeName(name) {
      cy.wait(5000)
      cy.get('input#prevPassword').type($password)
      cy.get("[placeholder='display name']").clear().type(name)
      cy.get('.auth-form > .btn').click()
      cy.wait(4000)
      cy.get(".user > p").should('include.text', name)
    }

     changeName(newName)
     // change it back
     cy.visit('/updateuser')
     cy.wait(5000)
     changeName($displayName)
  })

  // skip this unless you want to verify email address and change it back
  it.skip('allows user update both email address and password', () => {
    cy.wait(5000)
    fillInEmailPassword(newEmail, $password)
    enterNewPasswords('newPassword123')
    cy.get('.auth-form > .btn').click()
    cy.findByText(/A verification email/, { timeout: 5000 }).should('be.visible')
  })

  it.only('allows user to change display or hide email addres', () => {
    function clickShareEmail(textExpected, check) {
      cy.get('input#prevPassword').type($password)
      if (check) {
        cy.get('[cy-test-id=share-email]').check()
      } else {
        cy.get('[cy-test-id=share-email]').uncheck()
      }
      cy.get('.auth-form > .btn').click()
      cy.wait(10000)
      cy.visit('/person/oIjeo62z08fpAi9F55yR')
      cy.wait(5000)
      cy.get('.creator').trigger('mouseover')
      cy.get('.tip').contains(textExpected, { matchCase: false })
    }

    // should begin test with shared email
    clickShareEmail($email, true)
    cy.visit('/updateuser')
    cy.wait(5000)
    clickShareEmail('This user has a private email', false)
    // put back to shared email
    cy.wait(5000)
    cy.visit('/updateuser')
    cy.wait(5000)
    clickShareEmail($email, true)
  })

 
  after(() => {
    cy.logout()
    
  })

})