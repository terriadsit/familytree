// a React Select Dropdown, state is managed by calling Component,
// Add Relatives manages changing values in the Select
///<reference types="cypress" />

describe('allows users to choose relatives', () => {
  

  function chooseAndRemove (number, relationship) {
    const testId = `[cy-test-id=${relationship}]`
    const person = `second ${relationship} test 100`

    cy.choose(number, relationship)
    cy.get('.css-1rhbuit-multiValue')
      .eq(0)
      .find('svg')
      .click()
    
  }

  before(() => {
    cy.login()
   
  })

  beforeEach(() => {
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
  })

  it('choice of each realtive may be made then removal from select box', () => {
    
    chooseAndRemove(0, 'siblings')
    chooseAndRemove(1, 'parents')
    chooseAndRemove(2, 'children')
    chooseAndRemove(3, 'spouse')
  })

  it('allows the choice of each relative to be made and saved', () => {
    // add relatives
    cy.wait(5000)
    cy.choose(0, 'siblings')
    cy.choose(1, 'parents')
    cy.choose(2, 'children')
    cy.choose(3, 'spouse')
    cy.wait(15000)
    // save relatives
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(15000)
    cy.get('[cy-test-id=siblings]').should(
      'include.text',
      'second siblings test 100'
    )
    cy.get('[cy-test-id=parents]').should(
      'include.text',
      'second parents test 100'
    )
    cy.get('[cy-test-id=children]').should(
      'include.text',
      'second children test 100'
    )
    cy.get('[cy-test-id=spouse]').should(
      'include.text',
      'second spouse test 100'
    )
    // remove these added relatives
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(15000)
    cy.get('[cy-test-id=relative-form]')
      .find("[value='8nDk5GhtsY1o0MgoX0LJ']")
      .click()
    cy.get('[cy-test-id=relative-form]')
      .find("[value='MnWuNIRhb8Csch0280W8']")
      .click()
    cy.get('[cy-test-id=relative-form]')
      .find("[value='oIjeo62z08fpAi9F55yR']")
      .click()
    cy.get('[cy-test-id=relative-form]')
      .find("[value='qZPStncFZgPYlLqXGJMi']")
      .click()
    cy.wait(5000)
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(15000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(15000)
    cy.get('[cy-test-id=siblings]').should(
      'not.include.text',
      'second siblings test 100'
    )
    cy.get('[cy-test-id=parents]').should(
      'not.include.text',
      'second parents test 100'
    )
    cy.get('[cy-test-id=children]').should(
      'not.include.text',
      'second children test 100'
    )
    cy.get('[cy-test-id=spouse]').should(
      'not.include.text',
      'second spouse test 100'
    )
  })

  after(() => {
    cy.logout()
  })
})
