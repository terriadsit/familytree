/// <reference types="Cypress" />
  // let the user know if birthdate and city are unknown, 
  // don't try to display a null Imageurl

  describe('person snippets display correctly, function as links', () => {
  
  before(() => {
    cy.login()
    
  })

  beforeEach(() => {
    cy.visit('/')
    cy.wait(5000)
  })
  it('links to person page', () => {
    cy.get('div:nth-of-type(1) > a > h4')
    .then(($title) => {
      const txt = $title.text()
      cy.wrap($title).click()
      cy.get('[cy-test-id=person-name]').should(($title2) => {
        expect($title2.text()).to.eq(txt)
      })
    })
    
  })
  it('displays image if provided', () => {
    cy.get('[cy-test-id=w24t8yLaxdS4Qw6V2VTo]').within(() => {
      cy.get('img').should('be.visible')
    })
  })

  it('displays a birthdate and city if known, else displays unknown', () => {
    cy.get('[cy-test-id=lyKCDXMCnc0TUTnNGCs4]').within(() => {
      cy.get('p').should('include.text','born in: unknown')
        .and('include.text', 'birth date: unknown')
    })
    cy.get('[cy-test-id=w24t8yLaxdS4Qw6V2VTo]').within(() => {
      cy.get('p').should('include.text','born in: Racine, WI')
        .and('include.text', 'birth date: 2022-07-01')
    })
  })

  
  after(() => {
    cy.logout()
  })
  
})