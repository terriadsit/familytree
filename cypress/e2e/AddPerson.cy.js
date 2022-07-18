// add or update a new person to the db depending on "action"
// then navigate to <AddRelatives> to add or update relatives

/// <reference types="cypress" />

describe('Add Person works and dislays correctly, including error messsages', () => {
  
  const random = Math.random().toString(36).substring(2) 
 
  function addAPersonNavigate(name, button, url) {
    cy.get('[cy-test-id=name]').type(name)
    cy.get(button).click()
    cy.url().should('include', url)
    cy.wait(5000)
  }

  function removeAPerson(name) {
    cy.visit('/')
    cy.wait(5000)
    cy.findAllByText(name).eq(0).click()
    cy.wait(5000)
    cy.get('[cy-test-id=delete-button]').click()
    
  }

  before(() => {
    cy.login()
    cy.wait(5000)
  })
  
  beforeEach(() => {
    cy.visit('/addperson?action=create')
    cy.wait(5000)
  })
  
  it('has all the correct fields', () => {
    cy.get('[cy-test-id=name]').should('be.visible')
    cy.get('[cy-test-id=other-name]').should('be.visible')
    cy.get('[cy-test-id=birth-date]').should('be.visible')
    cy.get('[cy-test-id=death-date]').should('be.visible')
    cy.get('[cy-test-id=birth-place]').should('be.visible')
    cy.get('[cy-test-id=image]').should('be.visible')
    cy.get('[cy-test-id=marriage-comments]').should('be.visible')
    cy.get('[cy-test-id=comments]').should('be.visible')
  })

  it('the name field may not be left blank', () => {
    cy.get('[cy-test-id=name]').should('have.attr', 'required')
  })

  it.only('buttons send user to correct page', () => {
    const name = 'test AddPerson Cypress Test'
    let button = '[cy-test-id=add-relatives]'
    let url = 'addrelatives'
    cy.log('in body', name, 'button',button,'url', url)
    addAPersonNavigate(name, button, url)
    
    cy.get('[cy-test-id=person-name]').should('include.text', name)
    
    removeAPerson(name)
    
  })

  it('automatically adds new person to users home page', () => {
    
  })

  it('correctly adds a person including all of the fields', () => {
    
  })

  after(() => {
    cy.logout()
  })
})