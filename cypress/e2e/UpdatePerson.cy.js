///<reference types="cypress" />

describe('updates a users details, relatives managed in AddRelatives, ChooseRemoveRelatives tests', () => {
  
  before(() => {
    cy.login()
    cy.wait(5000)
  })
  
  beforeEach(() => {
    cy.visit('/updateperson/DSa9NjUWT9qgr9RaMGuy')
    cy.wait(5000)
  })
  it('displays each field of previous information correctly', () => {
    cy.get('[cy-test-id=name]').should('have.value','test 100 updatePerson test')
    cy.get('[cy-test-id=other-name]').should('have.value','other name' )
    cy.get('[cy-test-id=birth-date]').should('have.value','2001-01-01')
    cy.get('[cy-test-id=death-date]').should('have.value', '2022-02-02')
    cy.get('[cy-test-id=birth-place]').should('have.value', 'birth city') 
    cy.get('[cy-test-id=marriage-comments]').should('have.value','marriage comments')
    cy.get('[cy-test-id=comments]').should('have.value','comments')
    cy.get('[cy-test-id=image]').should('be.visible')
 })


  it('allows each field to be changed', () => {
    //changing image tested manually
    // change inputs
    cy.get('[cy-test-id=name]').clear().type('test 100 updatePerson test2')
    cy.get('[cy-test-id=other-name]').clear().type('other name2' )
    cy.get('[cy-test-id=birth-date]').clear().invoke('removeAttr','type').type('2001-01-05')
    cy.get('[cy-test-id=death-date]').clear().invoke('removeAttr','type').type('2022-02-05')
    cy.get('[cy-test-id=birth-place]').clear().type( 'birth city2') 
    cy.get('[cy-test-id=marriage-comments]').clear().type('marriage comments2')
    cy.get('[cy-test-id=comments]').clear().type('comments2')
    cy.get('[cy-test-id=submit-form]').click()
    cy.wait(5000)
    // assert changes
    cy.visit('/updateperson/DSa9NjUWT9qgr9RaMGuy')
    cy.wait(5000)
    cy.get('[cy-test-id=name]').should('have.value','test 100 updatePerson test2')
    cy.get('[cy-test-id=other-name]').should('have.value','other name2' )
    cy.get('[cy-test-id=birth-date]').should('have.value','2001-01-05')
    cy.get('[cy-test-id=death-date]').should('have.value', '2022-02-05')
    cy.get('[cy-test-id=birth-place]').should('have.value', 'birth city2') 
    cy.get('[cy-test-id=marriage-comments]').should('have.value','marriage comments2')
    cy.get('[cy-test-id=comments]').should('have.value','comments2')
    cy.get('[cy-test-id=image]').should('be.visible')
    //now change back to original
    cy.get('[cy-test-id=name]').clear().type('test 100 updatePerson test')
    cy.get('[cy-test-id=other-name]').clear().type('other name' )
    cy.get('[cy-test-id=birth-date]').clear().invoke('removeAttr','type').type('2001-01-01')
    cy.get('[cy-test-id=death-date]').clear().invoke('removeAttr','type').type('2022-02-02')
    cy.get('[cy-test-id=birth-place]').clear().type( 'birth city') 
    cy.get('[cy-test-id=marriage-comments]').clear().type('marriage comments')
    cy.get('[cy-test-id=comments]').clear().type('comments')
    cy.get('[cy-test-id=submit-form]').click()
    cy.wait(5000)
  })

  it('displays an error if anyone besides this persons creator attempts update', () => {
    cy.visit('updateperson/MIsJDHy4lZJdNU0G7S1z')
    cy.get('.error').should('be.visible')
  })

  after(() => {
    cy.logout()
  })
})