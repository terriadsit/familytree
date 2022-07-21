// add or delete comments, call <comment list />
// displayed on <Person />

/// <reference types="Cypress" />

describe('correctly adds or deletes comments', () => {

  function addThenDeleteComment(type, fileName) {
       
    const inputField = type === 'image' ? '[cy-test-id=image-file]' : '[cy-test-id=pdf-file]'
    
    cy.get(inputField).attachFile(fileName)
    cy.get('[cy-test-id=comment-to-add]').type('a temporary comment by FT100 w/ an image')
    cy.get('[cy-test-id=add-comment-btn]').click()
    cy.wait(10000)
    cy.get('.comment-list-item').last().find('[cy-test-id=comment-content]')
      .should('include.text','a temporary comment by FT100 w/ an image')
    if (type === 'image') {
      cy.get('.comment-list-item').last().find('img')
        .should('be.visible')
    } else {
      cy.get('.comment-list-item').last().within(() => {
        cy.get("[alt='user added pdf']").should('have.attr', 'href')
        }) 
    }
    cy.get('.comment-list-item').last().find('.deleteBtn').click()
    cy.wait(10000)
    cy.get('.comment-list-item').last().find('[cy-test-id=comment-content]')
      .should('not.have.text','a temporary comment by FT100 w/ an image')
  }

  before(() => {
    cy.login()
    cy.visit("/person/w24t8yLaxdS4Qw6V2VTo")
  })

  it('correctly adds and deletes a comment containing only text', () => {
    // tested in CommentList.cy.js
    
  })

  it('will add a comment containing a correct pdf type and pdf size', () => {
    addThenDeleteComment('pdf','../fixtures/weaving.pdf')
  })

  it('correctly adds and deletes a comment containing an image', () => {
    addThenDeleteComment('image','../fixtures/me.jpg')
  })

  it('will not add a comment containing an incorrect image type', () => {
    cy.get('[cy-test-id=image-file]').attachFile('../fixtures/weaving.pdf')
    cy.wait(5000)
    cy.get('.error').should('be.visible')
  })

  it('will not add a comment containing an incorrect pdf type or pdf size', () => {
    cy.get('[cy-test-id=pdf-file]').attachFile('../fixtures/TooBig.pdf')
    cy.wait(5000)
    cy.get('.error').should('be.visible')
    cy.get('[cy-test-id=pdf-file]').attachFile('../fixtures/mike.jpg')
    cy.wait(5000)
    cy.get('.error').should('be.visible')
  })

  

  after(() => {
    cy.logout()
  })


})