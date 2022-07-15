// a React Select Dropdown, state is managed by calling Component,
// Add Relatives manages state and changing values in the Select
///<reference types="cypress" />

describe('allows users to choose relatives', () => {
  function choose (number, relationship) {
    const testId = `[cy-test-id=${relationship}]`
    const person = `second ${relationship} test 100`

    cy.get('.css-6j8wv5-Input')
      .eq(number)
      .click()
      .type(`${person}{enter}`)
    cy.get(testId).should('include.text', person)
  }

  function chooseAndRemove (number, relationship) {
    const testId = `[cy-test-id=${relationship}]`
    const person = `second ${relationship} test 100`

    choose(number, relationship)
    cy.get('.css-1rhbuit-multiValue')
      .eq(0)
      .find('svg')
      .click()
    cy.get(testId).should('not.include.text', person)
  }

  before(() => {
    cy.login()
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
  })

  it('choice of each realtive may be made then removal from select box, keep state correct', () => {
    chooseAndRemove(0, 'siblings')
    chooseAndRemove(1, 'parents')
    chooseAndRemove(2, 'children')
    chooseAndRemove(3, 'spouse')
  })

  it('allows the choice of each realtive to be made and saved', () => {
    // add relatives
    choose(0, 'siblings')
    choose(1, 'parents')
    choose(2, 'children')
    choose(3, 'spouse')
    cy.wait(5000)
    // save relatives
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
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
    cy.wait(5000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
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
