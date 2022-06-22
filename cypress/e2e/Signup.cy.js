describe('Signup page should appear and operate correctly', () => {
  beforeEach(() => {
    cy.visit ('/signup?action=create')
    
  })
  it('Signup page loads and contains required fields', () => {
    cy.findByPlaceholderText('email')
    cy.findByPlaceholderText('password')
    cy.findByPlaceholderText('check password')
    cy.findByPlaceholderText('display name')
    cy.findByLabelText('Check to allow other users access to your email address:')
    cy.get("input[type='checkbox']").should('not.be.checked')
    cy.get('.btn').contains('Signup')
  })
})