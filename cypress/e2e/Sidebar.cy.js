describe('Sidebar should appear correctly and be functionally correct', () => {
 
  function checkAppearance() {
    cy.get("[href='\/addperson\?action\=create'] span").should('contain', 'Add a Person')
    cy.get("[href='\/search'] span").should('contain', 'Search')
    cy.get("ul h4").should('contain','All People (Birth Names):')
    cy.get("li:nth-of-type(1) > .person-list-item > .person-in-list").should('be.visible')
  }
 
  beforeEach(() => {
    cy.visit('/')
  })
  it('appears correctly to logged in users', () => {
    cy.login()
    cy.visit('/')
    const displayName = Cypress.env('DISPLAY_NAME')
    const message = `Welcome ${displayName}!`
    cy.findByText(message)
    checkAppearance()
    cy.logout()
  })

  it('links work correctly for logged in users', () => {
    cy.login()
    // add person link works
    cy.get("[href='\/addperson\?action\=create'] span").click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/addperson')
      expect(loc.search).to.eq('?action=create')
    })
    // search link works
    cy.get("[href='\/search'] span").click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/search')
    })
    // clicking on person in list works
    cy.get(".person-in-list").eq(0)
      .invoke('text')
      .then((text1) => {
        //get name up to comma
        const name1 = text1.substring(0, text1.indexOf(","));
        //click on this person, loaded page has this person
        cy.get(".person-in-list").eq(0).click()
          .then(() => {
            cy.get('[cy-test-id=person-name]').should('contain.text', name1)
          })
       })
    cy.logout()
  })

  it('appears correctly to those not logged in', () => {
    const message = 'Welcome! Please Sign Up and Login to access the options below.'
    cy.findByText(message)
    checkAppearance()
   })

  it('links do not work for those not logged in', () => {
    // add person link does not work
    cy.get("[href='\/addperson\?action\=create'] span").click()
    cy.get('h2').should('contain.text', 'Login')
    
    // search link does not work
    cy.get("[href='\/search'] span").click()
    cy.get('h2').should('contain.text', 'Login')

    // clicking on person in list does not work
    cy.get("li:nth-of-type(1) > .person-list-item > .person-in-list").click()
    cy.get('h2').should('contain.text', 'Login')
  })
})