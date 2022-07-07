describe('Displays all details of a person on a person page but not comments on addrelatives page', () => {
  
  function checkMostEntries() {
    cy.get('h3').should('include.text', 'test 100s creation (test other name)')
    cy.get("[cy-test-id=born]").should('include.text', '2022-07-01 to 2022-07-31')
    cy.get("[cy-test-id=birth-city]").should('include.text', 'Racine, WI')
    cy.get("[cy-test-id=parents]").should('include.text', 'parent test 100')
    cy.get("[cy-test-id=siblings]").should('include.text', 'sibling test 100')
    cy.get("[cy-test-id=spouse]").should('include.text', 'spouse test 100, a marriage comment')
    cy.get("[cy-test-id=children]").should('include.text', 'children test 100')
  }

  before(() => {
    cy.login()
  })
  
  it('contains all of the fields on Person Summary', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    checkMostEntries()
    cy.get("[cy-test-id=comments]").should('include.text', 'a comment and memory')
  
  })

  it('contains all of the fields except comments on AddRelatives', () => {
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    checkMostEntries()
  })
})

after(() => {
  cy.logout()
})
// displays details of a person
// called by <PersonSummary /> and <AddRelatives />
// receives a person with all their details as props
// will allow person to be added to home page of user
// do not display person.comments if on /addrelatives pages