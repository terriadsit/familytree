// add or update a new person to the db depending on "action"
// then navigate to <AddRelatives> to add or update relatives
// begin test w/o person: test AddPerson Cypress Test in existence
/// <reference types="cypress" />

describe('Add Person works and dislays correctly, including error messsages', () => {
  
  const random = Math.random().toString(36).substring(2) 
 
  function removeAPerson(name) {
    cy.visit('/')
    cy.wait(15000)
    cy.findAllByText(name).eq(0).click()
    cy.wait(5000)
    cy.get('[cy-test-id=person-name]').should('include.text', name)
    cy.wait(5000)
    cy.get('[cy-test-id=delete-button]').click()
    cy.wait(7000)
  }

  before(() => {
    cy.login()
    cy.wait(5000)
  })
  
  beforeEach(() => {
    cy.visit('/addperson?action=create')
    cy.wait(5000)
  })
  
  it('has all the correct fields', () => {
    cy.get('[cy-test-id=name]').should('be.visible')
    cy.get('[cy-test-id=other-name]').should('be.visible')
    cy.get('[cy-test-id=birth-date]').should('be.visible')
    cy.get('[cy-test-id=death-date]').should('be.visible')
    cy.get('[cy-test-id=birth-place]').should('be.visible')
    cy.get('[cy-test-id=image]').should('be.visible')
    cy.get('[cy-test-id=marriage-comments]').should('be.visible')
    cy.get('[cy-test-id=comments]').should('be.visible')
  })

  it('the name field may not be left blank', () => {
    cy.get('[cy-test-id=name]').should('have.attr', 'required')
  })

  it('add Relatives button sends user to correct page', () => {
    const name = 'test AddPerson Cypress Test'
    let button = '[cy-test-id=add-relatives]'
    let url = 'addrelatives'
    let image = 'me.jpg'
    
    cy.log('in body', name, 'button',button,'url', url)
    cy.addAPersonNavigate(name, button, image, url, false)
    removeAPerson(name)
  })

  it('submit button sends user to correct page', () => {
    const name = 'test AddPerson Cypress Test'
    const url = '/'
    const button = '[cy-test-id=submit-form]'
    let image = 'me.jpg'
    cy.get('[cy-test-id=name]').type(name)
    cy.get(button).click()
    cy.wait(5000)
    removeAPerson(name)

  })

  it('automatically adds new person to users home page', () => {
    const name = 'test AddPerson Cypress Test'
    const url = '/'
    const button = '[cy-test-id=submit-form]'
    let image = 'me.jpg'

    cy.addAPersonNavigate(name, button, image, url, false)
    cy.get('.container').should('include.text', name)
    removeAPerson(name)
  })

  it('correctly adds a person including all of the fields', () => {
    const name = 'test AddPerson Cypress Test'
    const url = '/'
    const button = '[cy-test-id=submit-form]'
    let image = 'me.jpg'

    cy.get('[cy-test-id=name]').type(name)
    cy.get('[cy-test-id=other-name]').type('another name')
    cy.get('[cy-test-id=birth-date]').invoke('removeAttr','type').type('2001-01-01{enter}')
    cy.get('[cy-test-id=death-date]').invoke('removeAttr','type').type('2022-02-02{enter}')
    cy.get('[cy-test-id=birth-place]').type('birth place')
    cy.get('[cy-test-id=marriage-comments]').type('a marriage comment')
    cy.get('[cy-test-id=comments]').type('a comment')
    cy.get('[cy-test-id=image]').attachFile(`../fixtures/${image}`)
    cy.wait(5000)
    cy.get(button).click()
    cy.wait(1000)
    //addAPersonNavigate does not work here for firefox, weird
    
    cy.findAllByText(name).eq(0).click()
    cy.wait(10000)
    cy.get('[cy-test-id=person-name]').should('include.text', name)
    cy.get('[cy-test-id=person-name]').should('include.text', 'another name')
    cy.get('[cy-test-id=born]').should('include.text','2001-01-01')
    cy.get('[cy-test-id=born]').should('include.text', '2022-02-02')
    cy.get('[cy-test-id=birth-city]').should('include.text', 'birth place')
    cy.get('[cy-test-id=spouse]').should('include.text', 'a marriage comment')
    cy.get('[cy-test-id=comments]').should('include.text', 'a comment')
    cy.get('.image').should('be.visible')
    removeAPerson(name)
    
  })

  it('will not allow an image that is too large to be saved', () => {
    const name = 'test AddPerson Cypress Test'
    const url = '/'
    const button = '[cy-test-id=submit-form]'
    let image = 'TooLarge.jpg'

    cy.addAPersonNavigate(name, button, image, url, true)
    cy.findByText(/the image is too large/,{ timeout: 3000 }).should('be.visible')
    cy.wait(5000)
    removeAPerson(name)
  })

  after(() => {
    cy.logout()
  })
})