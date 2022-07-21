
describe('Signup component should appear and operate correctly', () => {
  
  function fillInForm(email, password1, password2, displayName) {
    cy.findByPlaceholderText('email').clear().type(email)
    cy.findByPlaceholderText('password').clear().type(password1)
    cy.findByPlaceholderText('check password').clear().type(password2)
    cy.findByPlaceholderText('display name').clear().type(displayName)
  }
  
  beforeEach(() => {
    cy.visit ('/signup?action=create')
    cy.wait(5000)
  })

  it('Signup component loads and contains required fields, links and text', () => {
    fillInForm('1', '2', '3', '4')
    cy.findByLabelText('check to allow other users to view your email address')
    cy.get("input[type='checkbox']").should('not.be.checked')
    cy.get('.btn').contains('Signup')
  })

  it('outputs an error when passwords do not match or are blank', () => {
      fillInForm('emailtest@dispostable.com', '2', 'testing123', 'test person')
      cy.get('#password-error').should('contain','password fields must match')
      fillInForm('emailtest@dispostable.com', 'testing123','2',  'test person')
      cy.get('#password-error').should('contain','password fields must match')
      cy.findByPlaceholderText('password').clear()
      cy.findByPlaceholderText('check password').clear()
      cy.get('.btn').contains('Signup').click()
      cy.findByText('a password is required').should('be.visible')
  })

  it('requires email and display name', () => {
      fillInForm('tempemail@dispostable.com','testing123', 'testing123', 'test person' )
      cy.findByPlaceholderText('email').clear()
      cy.get('.btn').click()
      cy.get('input:invalid').should('have.length', 1)
      fillInForm('tempemail@dispostable.com','testing123', 'testing123', 'test person' )
      cy.findByPlaceholderText('display name').clear()
      cy.get('input:invalid').should('have.length', 1)
  })

  
  it('is submitted when valid then redirects to the login page', () => {
    const random = Math.random().toString(36).substring(2) 
    const email = `test${random}@mailinator.com`
    const $password = Cypress.env('PASSWORD')
    // box checked not being tested
    fillInForm(email,'testing123', 'testing123', 'test person' )
    cy.get("input[type='checkbox']").check()
    cy.checkSignupBtn('signUp')
    cy.deleteThisUser(email, $password)
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
    fillInForm('tempeperson@dispostable.com','test', 'test', 'test person' )
    cy.get('.btn').contains('Signup').click()
    cy.get('.error').should('be.visible')

    // email already in use caught by firebase
    fillInForm('familytree@dispostable.com','test123', 'test123', 'test person' )
    cy.get('.btn').contains('Signup').click()
    cy.get('.error').should('be.visible')

  }) 
  
})