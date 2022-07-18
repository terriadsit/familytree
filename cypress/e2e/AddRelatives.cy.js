// manage adding and updating (remove or add) relatives, 
// called by <AddPerson>
// holds state for relatives wh/ is updated through props functions managed here
// <ChooseRelatives /> from a react-select field
// <RemoveRelatives /> from previously added relatives

/// <reference types="cypress" />

describe('AddRelatives manages relationships in DB and displays all components correctly', () => {
  
  function addAssertRemoveAssert(number, relationship, id, otherRelationship) {
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.choose(number, relationship)
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit(`/person/${id}`)
    cy.wait(5000)
    cy.get(`[cy-test-id=${otherRelationship}]`).should('include.text', 'test 100s creation')
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get(`[value=${id}]`).click()
    cy.wait(5000)
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit(`/person/${id}`)
    cy.wait(5000)
    cy.get(`[cy-test-id=${otherRelationship}]`).should('not.include.text', 'test 100s creation')
  }

  before(() => {
    cy.login()
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
  })
  
  it('displays ChooseRelatives, RemoveRelatives and PersonDetails', () => {
    cy.get('[cy-test-id=person-name]').should('include.text', 'test 100s')
    // displays ChooseRelatives, RemoveRelatives done on 
    // ChooseRemoveRelatives.cy.js
  })

  it('will only display for the user who created this person', () => {
    cy.visit('/addrelatives/MIsJDHy4lZJdNU0G7S1z')
    cy.wait(5000)
    cy.get('.error').should('be.visible')
    cy.visit('/addrelatives/8nDk5GhtsY1o0MgoX0LJ')
    cy.wait(5000)
    cy.get('.error').should('not.exist')
  })

  it('Does not allow duplicate relatives to be added', () => {
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.get('.css-6j8wv5-Input').eq(0).click().type('sibling test 100')
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit('/addrelatives/w24t8yLaxdS4Qw6V2VTo')
    cy.get('.css-6j8wv5-Input').eq(0).click().type('sibling test 100')
    cy.get('[cy-test-id=add-relatives-btn]').click()
    cy.wait(5000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.wait(5000)
    cy.get('[cy-test-id=siblings]').invoke('text').then(($text) => {
      cy.log($text)
      let string = $text
      let firstIndex = string.indexOf('sibling test 100')
      let  foundTwice = firstIndex !== string.lastIndexOf('sibling test 100')
      cy.log('foundTwice', foundTwice)
      assert.isFalse(foundTwice)
    })
  })

  it('adds & removes sibling relationships when sibs are added or removed', () => {
    addAssertRemoveAssert(0, 'siblings', '8nDk5GhtsY1o0MgoX0LJ', 'siblings')
  })

  it('adds & removes spouse relationships when spouses are added or removed', () => {
    addAssertRemoveAssert(3, 'spouse', 'qZPStncFZgPYlLqXGJMi', 'spouse')
  })

  it('adds & removes children relationships when parents are added or removed', () => {
    addAssertRemoveAssert(1, 'parents', 'MnWuNIRhb8Csch0280W8', 'children')
  })

  it('adds & removes parent relationships when children are added or removed', () => {
    addAssertRemoveAssert(2, 'children', 'oIjeo62z08fpAi9F55yR', 'parents')
  })

  after(() => {
    cy.logout()
  })
})