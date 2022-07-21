/// <reference types="Cypress" />

describe('Created By displays creators display name', () => {
  const $creator = Cypress.env('DISPLAY_NAME')
  before(() => {
    cy.login()
    cy.visit('http://localhost:3000/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
  })

  it('displays creators name in a persons details', () => {
     cy.get('.person-details > .creator > p').should('include.text', $creator)
  })

  it('displays creators name in a comment', () => {
    cy.get('.comment-list-item> .creator > p').should('include.text', $creator)
 
  })
  
  after(() => {
    cy.logout()
  })
})