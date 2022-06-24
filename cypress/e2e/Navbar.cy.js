
describe('Navbar displays and works correctly', () => {

  // begin each as logged in so state is known
  beforeEach(() => {
    cy.login('terriadsit@yahoo.com', 'testing123')
    cy.get('.logo > img').should('be.visible')
    cy.get('.logo > span').should('be.visible')
    cy.findByText('FAQ').click()
    cy.findByText('Frequently Asked Questions').should('be.visible')
  
  })
  it('links correct for logged in users', () => {
    cy.get("[href='\/']").click()
    cy.location('pathname').should('eq', '/')
    cy.get("[href='\/updateuser']").click()
    cy.location('pathname').should('eq', '/updateuser')
    cy.get("[cy-test-id='logoutBtn']").click()
    cy.get("[href='\/login']").should('be.visible')
 })
  it.only('displays correctly for nonlogged in users', () => {
    cy.get("[cy-test-id='logoutBtn']").click()
    cy.get("[href='\/login']").should('be.visible')
  })
})