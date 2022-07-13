// comments are stored in db in their own file 
// with a field that contains the person's id who the comment applies to
// as well as the creator's uid as a field 
// list through these
// only allow deletions by creator of the person or the creator of the comment
// loaded by <PersonComments > wh/ handles adding new comments
// calls <createcBy />

/// <reference types="Cypress" />

describe('comments in list are all displayed correctly', () => {
  
  const uid = Cypress.env('TEST_UID')

  before(() => {
    cy.login()
  })

  it('allows creator of comment to delete it', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get('[cy-test-id=comment-to-add]').type('a test comment made by ' + uid)
    cy.get('[cy-test-id=add-comment-btn]').click()
    cy.wait(5000)
    cy.get('.comment-list-item').last().find('.comment-content').should('have.text', 'a test comment made by ' + uid)
    cy.get('.comment-list-item').last().find('.deleteBtn').click()
    cy.get('.comment-list-item').last().find('.comment-content').should('not.have.text', 'a test comment made by ' + uid)
  })

  it.only('allows creator of person to delete it', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(25000)
    cy.get('.comment-list-item').each(($el) => {
      expect($el).to.have.descendants('.deleteBtn')
    })
  })

  it('does not anyone else to delete it', () => {
    
  })

  it('displays all comments in list', () => {
    
  })

  it('displays comment, createdBy, time stamp, image if available, pdf title if available', () => {
    
  })

  it('opens pdf in a new window if available', () => {
    
  })

  after(() => {
    cy.logout()
  })

})