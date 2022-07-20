/// <reference types="cypress" />

describe('Navbar displays and works correctly', () => {

  
   beforeEach(() => {
     cy.visit('/')
     // logo displays and FAQ link works whether logged in or not
     cy.get('.logo > img').should('be.visible')
     cy.get('.logo > span').should('be.visible')
     cy.findByText('FAQ').click()
     cy.findByText('Frequently Asked Questions').should('be.visible')
   })
   
  it('links display and link correctly for users not logged in', () => {
    // user can go to log in screen with link
    cy.get("[href='\/login']").click()
    cy.get('.auth-form > h2').should('contain','Login')
    cy.get("[href='\/signup\?action\=create']").click()
    cy.get('.auth-form > h2').should('contain','Signup')
  })

  it('links are correct and work for when user logged in', () => {
    cy.login()
    cy.visit('/')

    cy.get("[href='\/updateuser']").click()
    cy.location('pathname').should('eq', '/updateuser')
      
    cy.get("[cy-test-id='logoutBtn']").click()
    cy.location('pathname').should('eq', '/')
    cy.logout()
  })
})