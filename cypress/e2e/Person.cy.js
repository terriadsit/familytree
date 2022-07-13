// displays all of the persons details and allows additional comments
// to be added calls <PersonSummary /> and <PersonComments />

/// <reference types="Cypress" />

describe('correctly displays for correct personid and error message else', () => {
  
  before(() => {
    cy.login()
  })
  
  it('shows error message if person id is incorrect', () => {
    cy.visit('/person/notARealId')
    cy.get('.error').should('be.visible')
    
  })

  it('loads comments component, personSummary component', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.get('.comments').should('be.visible')
    cy.get('.person-summary').should('be.visible')
  
  })

  after(() => {
    cy.logout()
  })

})