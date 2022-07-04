/// <reference types="Cypress" />


describe('update user appears and operates correctly', () => {
  
  const random = Math.random().toString(36).substring(2) 
  const $password = Cypress.env('PASSWORD')
  const $email = Cypress.env('EMAIL') 

  beforeEach(() => {
    cy.login()
    cy.visit('/updateuser')
  })
  
  

  it('displays correct fields and buttons', () => {
    // done in Signup.cy.js except for current password field
    cy.get('input#prevPassword').should('have.attr', 'type', 'password')
    
  })

  it('displays current user information', () => {
    cy.wait(4000)
    cy.get("[placeholder='email']").should('have.value', 'terriadsit@gmail.com')
    // get current user name from sidebar
    cy.get(".user > p")
      .then(data => {
        const length = data.text().length
        const sidebarName = data.text().substring(8, length-1)
        cy.get("[placeholder='display name']").should('have.value', sidebarName)
      })
    cy.get("input[type='checkbox']").should('not.be.checked')
  })

  it('update button submits changes', () => {
    
  })

  it('requires corrrect current password before submitting, else errors handled', () => {
    cy.get('input#prevPassword').should('have.attr', 'required')
    cy.get('input#prevPassword').type('thisisincorrect')
    cy.get('.auth-form > .btn').click()
    cy.findByText(/Current password entered was incorrect./, { timeout: 5000 }).should('be.visible')
  })

  

  it('does not allows user to change email address to nonemail type, empty or in use email', () => {
    
  })

  it('allows user to change password', () => {
    cy.wait(5000)
    const newPassword = 'newPassword123'
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type($password)
    cy.get("[placeholder='password']").type(newPassword)
    cy.get("[placeholder='check password']").type(newPassword)
    cy.get('.auth-form > .btn').click()
    cy.get("[href='\/updateuser']").click()
    cy.wait(5000)
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type(newPassword)
    cy.get("[placeholder='password']").type($password)
    cy.get("[placeholder='check password']").type($password)
    cy.get('.auth-form > .btn').click()
    cy.wait(5000)
    //cy.findByText(/Current password entered was incorrect./, { timeout: 5000 }).should('not.exist')
    //cy.get("[cy-test-id=logoutBtn]").click()
  })

  // just use if above test fails to reset password quickly
  it.skip('undo above test allows user to change password', () => {
    const newPassword = 'newPassword123'
    cy.wait(5000)
    cy.get("[placeholder='email']").clear().type($email)
    cy.get('input#prevPassword').type(newPassword)
    cy.get("[placeholder='password']").type($password)
    cy.get("[placeholder='check password']").type($password)
    cy.get('.auth-form > .btn').click()
    cy.wait(5000)
    cy.get("[cy-test-id=logoutBtn]").click()
  })

  it('error updating password logs you out', () => {
    
  })

  it('displays error for invalid password', () => {
    
  })

  it("allows users to change their email back to a previously used email", () => {

  })
  
  it.only('allows user to change email address, then must be verified', () => {
    cy.wait(5000)
    const newEmail = `familyTree${random}@dispostable.com`
    cy.get("[placeholder='email']").clear().type(newEmail)
    cy.get('input#prevPassword').type($password)
    cy.checkSignup()
  })
  
  it('allows user to change display name, is required, updates display name in sidebar', () => {
    const newName = `name${random}`
    cy.wait(5000)
    cy.get('input#prevPassword').type($password)
    cy.get("[placeholder='display name']").clear().type(newName)
    cy.get('.auth-form > .btn').click()
    cy.get(".user > p").should('include.text', newName)
    cy.wait(4000)
  })

  it('allows user update both email address and password', () => {
    
  })
  it('allows user change display email address or hide', () => {
    
  })

  afterEach(() => {
    cy.logout()
  })

})