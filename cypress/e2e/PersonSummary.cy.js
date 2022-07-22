/// <reference types="Cypress" />

// displays person details along with the ability to delete or edit 
// called by <Person /> receives person from db as props 
// only the creator of the person should be able to delete or edit
// this person

import getAPersonById from '../../src/manageFileStorage/getAPersonById'

describe('PersonSummary displays PersonDetails, Edit and Delete', () => {
  before(() => {
    cy.login()
  })

  const $password = Cypress.env('PASSWORD')
  
  
  it('displays all of a persons details by calling person details', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.get('[cy-test-id=person-name').should('contain.text','test 100s creation')
    cy.get('[cy-test-id=delete-button').should('be.visible')
    cy.get('[cy-test-id=edit-button').should('be.visible')
  })

  it('does not allow any but creator to edit or delete', () => {
    cy.logout()
    cy.wait(5000)
    cy.uiLogin('familytree@dispostable.com', $password )
    cy.wait(5000)
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.get('[cy-test-id=person-name').should('contain.text','test 100s creation')
   
    cy.get('[cy-test-id=delete-button').should('not.exist')
    cy.get('[cy-test-id=edit-button').should('not.exist')
    cy.logout()
    cy.login()
  })

  it('correctly deletes all links to this person if they are deleted', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    // first add the person to be deleted: name, image, relatives
    cy.get("[cy-test-id=add-person-link]").click()
    cy.get("[cy-test-id=name]").type('test 100s temporary person')
    cy.get("[cy-test-id=image]")
        .attachFile('../fixtures/hezekiah-thumbnail.jpg')
    cy.get("[value=add-relatives]").click()
    cy.wait(5000)
    cy.get('.relative').eq(0).type('sibling test 100{enter}',{ delay: 100}, {force: true})
    cy.get('.relative').eq(1).type('parent test 100{enter}',{ delay: 100}, {force: true})
    cy.get('.relative').eq(2).type('children test 100{enter}',{ delay: 100}, {force: true})
    cy.get('.relative').eq(3).type('spouse test 100{enter}',{ delay: 100}, {force: true})
    cy.get('[cy-test-id=add-relatives-btn]').click()
    // add a comment
    cy.findAllByText('test 100s temporary person').eq(0).click()
    cy.get('[cy-test-id=comment-to-add]').type('a test comment for test 100s temporary person')
    cy.get('[cy-test-id=add-comment-btn]').click()
    
    // now delete them
    cy.findAllByText('test 100s temporary person').eq(0).click()
    cy.url().then(($url) => {
      let personId = $url.slice(-20)
      cy.wrap(personId).as('personId')
      cy.log('person', personId)
    })
    cy.get('[cy-test-id=delete-button').click()
    cy.wait(10000)
    
    // should no longer be a relative of anyone
    cy.visit('/person/lyKCDXMCnc0TUTnNGCs4')
    cy.get('[cy-test-id=person-name]').should('contain.text', 'sibling test 100')
    cy.get('[cy-test-id=siblings]').should('not.contain', 'test 100s temporary person')
    cy.visit('person/cIRV0lju2GDAuXUORqit')
    cy.get('[cy-test-id=person-name]').should('contain.text', 'spouse test 100')
    cy.get('[cy-test-id=spouse]').should('not.contain', 'test 100s temporary person')
    cy.visit('person/RAe2bvzxGD5Otjt4FZYE')
    cy.get('[cy-test-id=person-name]').should('contain.text', 'parent test 100')
    cy.get('[cy-test-id=parents]').should('not.contain', 'test 100s temporary person')
    cy.visit('person/SsTrMjM0BGyB81VgtReo')
    cy.get('[cy-test-id=person-name]').should('contain.text', 'children test 100')
    cy.get('[cy-test-id=children]').should('not.contain', 'test 100s temporary person')
    
    // should not be on creators home page
    cy.visit('/')
    cy.get('.person-list > a > h4').each(($el, index, $list) => {
        cy.wrap($el).should('not.contain', 'test 100s temporary person')
    })
     
    // comments are no longer in db, checked manually
     
    // image should be deleted from fb storage - done in Image cy.test
    
    // person is also deleted -- check in list in sidebar
      cy.get('.person-in-list').each(($el, index, $list) => {
        cy.wrap($el).should('not.contain', 'test 100s temporary person')
    })
     
  })

  it('correctly allows creator to reach edit page', () => {
    cy.visit('/person/w24t8yLaxdS4Qw6V2VTo')
    cy.get('[cy-test-id=edit-button').click()
    cy.wait(5000)
    //just reach update page, can check updates on updatePerson test
    cy.url().should('include','updateperson/w24t8yLaxdS4Qw6V2VTo')
  })

  after(() => {
    cy.logout()
  })

})