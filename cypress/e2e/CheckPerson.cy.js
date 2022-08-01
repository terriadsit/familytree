/// <reference types="cypress" />
// called by <AddPerson /> to display possible duplicates to user

describe('CheckPerson reveals possible duplicates when using AddPerson Name field', () => {
  
  before(() => {
    cy.login()
    
  })

  beforeEach(() => {
    cy.visit('/addperson?action=create')
    cy.wait(5000)
  })
  
  it('displays possible duplicates if there is a possible duplicate', () => {
    cy.get('[cy-test-id=name]').clear().type('test ')
    cy.get('[cy-test-id=duplicate-heading]').should('be.visible')
  })

  it('doe not display if not a possible duplicate', () => {
    cy.get('[cy-test-id=name]').clear().type('1234567 ')
    cy.get('[cy-test-id=duplicate-heading]').should('not.exist')
  })

  after(() => {
    cy.logout()
  })
})