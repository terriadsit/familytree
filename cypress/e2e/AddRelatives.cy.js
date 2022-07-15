// manage adding and updating (remove or add) relatives, 
// called by <AddPerson>
// holds state for relatives wh/ is updated through props functions managed here
// <ChooseRelatives /> from a react-select field
// <RemoveRelatives /> from previously added relatives

/// <reference types="cypress" />

describe('AddRelatives manages relationships in DB and displays all components correctly', () => {
  
  before(() => {
    cy.login()
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
  })
  
  it('displays ChooseRelatives, RemoveRelatives and PersonDetails', () => {
    cy.get('[cy-test-id=person-name]').should('include.text', 'test 100s')
    // displays ChooseRelatives, RemoveRelatives done on 
    // ChooseRemoveRelatives.cy.js
  })

  it('will only display for the user who created this person', () => {
    cy.visit('/addrelatives/MIsJDHy4lZJdNU0G7S1z')
    cy.get('.error').should('be.visible')
  })

  it('Does not allow duplicate relatives to be added', () => {
    
  })

  it('adds & removes sibling relationships when sibs are added or removed', () => {
    
  })

  it('adds & removes spouse relationships when spouses are added or removed', () => {
    
  })

  it('adds & removes children relationships when parents are added or removed', () => {
    
  })

  it('adds & removes parent relationships when children are added or removed', () => {
    
  })

  after(() => {
    cy.logout()
  })
})