// display terms and conditions as a dropdown
// called by <FAQ /> and <Signup />

/// <reference types="Cypress" />

describe('displays cand functions orrectly', () => {

  it('hides or reveals drop down content on click', () => {
    cy.visit('/faq')
    cy.get('[cy-test-id=terms-content]').should('not.exist')
    cy.get('[cy-test-id=terms-trigger]').click()
    cy.get('[cy-test-id=terms-content]').should('be.visible')
    cy.get('[cy-test-id=terms-trigger]').click()
    cy.get('[cy-test-id=terms-content]').should('not.exist')
  })
})