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

  it('allows creator of person to delete it', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get('.comment-list-item').each(($el) => {
      expect($el).to.have.descendants('.deleteBtn')
    })
  })

  it('does not anyone else to delete it', () => {
    cy.visit('/person/o7LOCcgEjCKbysLGKimU')
    cy.wait(5000)
    cy.get('.comment-list-item').each(($el) => {
      expect($el).to.not.have.descendants('.deleteBtn')
    })
  })

  it('displays all comments in list', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get('.comment-list-item').should('have.length', 3)
  })

  it('displays comment, createdBy, time stamp, image if available, pdf title if available', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(10000)
    cy.get('.comment-list-item').eq(0).within(() => {
      cy.get('.image').should('be.visible')
      cy.get('.comment-date').should('be.visible')
      cy.get('.creator').invoke('text').should('include', 'entry created by')
      cy.get("[alt='user added pdf']").should('have.attr', 'href')
      cy.get('[cy-test-id=comment-content]').should('include.text', 'This comment has an image and a pdf')
   })
  })

  it('opens pdf in a new window if pdf is available', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get('.comment-list-item').eq(0).find("[alt='user added pdf']")
    .should('have.attr', 'target')
    .and('equal',"_blank")
  })

  after(() => {
    cy.logout()
  })

})