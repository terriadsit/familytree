
describe('Signup component should appear and operate correctly', () => {
  function fillInForm(email, password1, password2, displayName) {
    cy.findByPlaceholderText('email').clear()
    cy.findByPlaceholderText('password').clear()
    cy.findByPlaceholderText('check password').clear()
    cy.findByPlaceholderText('display name').clear()
   
    cy.findByPlaceholderText('email').type(email)
    cy.findByPlaceholderText('password').type(password1)
    cy.findByPlaceholderText('check password').type(password2)
    cy.findByPlaceholderText('display name').type(displayName)
    
  }
  
  beforeEach(() => {
    cy.visit ('/signup?action=create')
    
  })

  it('Signup component loads and contains required fields, links and text', () => {
    fillInForm('1', '2', '3', '4')
    cy.findByLabelText('Check to allow other users access to your email address:')
    cy.get("input[type='checkbox']").should('not.be.checked')
    cy.get('.btn').contains('Signup')
  })

  it('outputs an error when passwords do not match or are blank', () => {
      fillInForm('emailtest@gmail.com', '2', 'testing123', 'test person')
      cy.get('#password-error').should('contain','password fields must match')
      fillInForm('emailtest@gmail.com', 'testing123','2',  'test person')
      cy.get('#password-error').should('contain','password fields must match')
      cy.findByPlaceholderText('password').clear()
      cy.findByPlaceholderText('check password').clear()
      cy.get('.btn').contains('Signup').click()
      cy.findByText('a password is required').should('be.visible')
  })

  it('requires email and display name', () => {
      fillInForm('tempemail@gmail.com','testing123', 'testing123', 'test person' )
      cy.findByPlaceholderText('email').clear()
      cy.get('.btn').click()
      cy.get('input:invalid').should('have.length', 1)
      fillInForm('tempemail@gmail.com','testing123', 'testing123', 'test person' )
      cy.findByPlaceholderText('display name').clear()
      cy.get('input:invalid').should('have.length', 1)
  })

  // skip this unless you want to clear out new users from firebase
  it.skip('is submitted when valid then redirects to the login page', () => {
    const random = Math.random().toString(36).substring(2) 
    const email = `test${random}@mailinator.com`
    // box checked not being tested
    fillInForm(email,'testing123', 'testing123', 'test person' )
    cy.get("input[type='checkbox']").check()
    cy.intercept('POST','https://identitytoolkit.googleapis.com/v1/accounts:signUp**').as('signup')
    cy.get('.btn').click()
    cy.wait('@signup')
      .its('response.statusCode')
      .should('eq', 200)
    // popup appears
    cy.findByText('A verification email has been sent to you, it may be in your spam folder.').should('be.visible')
    // page redirects
    cy.url().should('contain','login')
    
  })

  it('displays or hides password when clicked', () => {
    fillInForm('1', '2', '3', '4')
    // before clicking reveal passwords:
    cy.findByPlaceholderText('password').should('have.attr','type', 'password')   
    cy.findByPlaceholderText('check password').should('have.attr','type', 'password')   
    // click reveal passwords:  
    cy.get('[cy-test-id="triggerBtn"]').click()
    cy.findByPlaceholderText('password').should('have.attr','type', 'text')   
    cy.findByPlaceholderText('check password').should('have.attr','type', 'text') 
    // click and hide again:
    // click reveal passwords:  
    cy.get('[cy-test-id="triggerBtn"]').click()
    cy.findByPlaceholderText('password').should('have.attr','type', 'password')   
    cy.findByPlaceholderText('check password').should('have.attr','type', 'password') 
  })

 it('invalid email or password according to firebase auth or mismatch result in error', () => {
     // no '@' caught by form
    fillInForm('tempemail gmailcom','testing123', 'testing123', 'test person' )
    cy.findByPlaceholderText('email').invoke('prop','validity')
       .should('deep.include', {
        typeMismatch: true
       })
    
    // no '.' in email caught by firebase  
    fillInForm('tempemail@gmailcom','testing123', 'testing123', 'test person' )
    cy.get('.btn').contains('Signup').click()
    cy.get('.error').should('be.visible')
    
    // poor passwords caught by firebase
    fillInForm('tempeperson@yahoo.com','test', 'test', 'test person' )
    cy.get('.btn').contains('Signup').click()
    cy.get('.error').should('be.visible')

    // email already in use caught by firebase
    fillInForm('terriadsit@yahoo.com','test123', 'test123', 'test person' )
    cy.get('.btn').contains('Signup').click()
    cy.get('.error').should('be.visible')

  }) 
  
})