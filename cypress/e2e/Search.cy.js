describe('search page appears and operates correctly', () => {
  
  beforeEach(() => {
    cy.login()
    cy.visit('/search')
  })
  
  it('appears correctly, all fields and buttons present', () => {
    cy.get('label > span').should('contain.text', 'All the people who have already been added:')
    cy.get('.css-6j8wv5-Input').should('be.visible')
    cy.get('.search > .btn').should('contain.text', 'View')
  })

  it.skip('dropdown search functions correctly', () => {
    // don't test other software's code execution
   
  })

  it('view button works correctly', () => {
    cy.wait(2000)
    cy.get('.css-6j8wv5-Input').click()
    cy.get('#react-select-3-option-0').click()
    cy.get(' .css-qc6sy-singleValue').then((text1) => {
      const name = text1.text()
      
      //click on this person, loaded page has this person
      cy.get('.search > .btn').click()
      cy.get('[cy-test-id=person-name]').should('contain.text', name)
      
    })
    
  })

  afterEach(() => {
    cy.logout()
  })
})