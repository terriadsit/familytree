describe('ToggleSwitch clicked displays and works', () => {
  
  before(() => {
    cy.login()
  })
  
  it('displays when unchecked, person does not show on home page', () => {
    cy.visit('/person/ivFMnMkBztZsALrTxliB')
    cy.get('.get-inline').should('contain.text', 'on my Home Page?')
    cy.get('#myCheck').should('not.be.checked')
  
  })

  it('displays when checked, person does show on homepage', () => {
    cy.visit('/person/RAe2bvzxGD5Otjt4FZYE')
    cy.get('.get-inline').should('contain.text', 'on my Home Page?')
    cy.get('#myCheck').should('be.checked')
  })
})