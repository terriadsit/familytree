describe('Login page appears and works correctly, allows verified users only', () => {
  const $email = Cypress.env('EMAIL')
  const $password = Cypress.env('PASSWORD')
  const $unverified = Cypress.env('UNVERIFIED')
  beforeEach(() => {
    cy.visit('/login')
  })

  it('contains correct fields, heading, labels', () => {
    cy.get('h2').should('contain', 'Login')
    cy.findByText('email:')
    cy.get("[type='email']").should('have.attr','required')
    cy.findByText("password (click here to view or hide):")
    cy.get("input#password").should('have.attr','required')
  })

  it('make password visible or not click event works', () => {
    cy.get("input#password").type('test').should('have.attr','type','password')
    cy.findByText("password (click here to view or hide):").click()
    cy.get("input#password").should('have.attr','type','text')
  })

  it('forgot password button works and notifies user with popup', () => {
    cy.get("[type='email']").type($email)
    cy.get('[cy-test-id=forgot-password]').click()
    cy.findByText(/reset password email has been sent/,{ timeout: 3000 }).should('be.visible')
  })

  it("sends an error message if the forgot password has an invalid email", () => {
    cy.get("[type='email']").type('invalid99323@mailinator.com')
    cy.get('[cy-test-id=forgot-password]').click()
    cy.findByText(/an error occurred/,{ timeout: 3000 }).should('be.visible')
  })
  
  it('logs in a verified user, no errors displayed', () => {
    cy.get("[type='email']").type($email)
    cy.get("input#password").type($password)
    cy.get('[cy-test-id=loginBtn]').click()
    cy.findByText(/an error occurred/,{ timeout: 1000 }).should('not.exist')
    cy.get('.error').should('not.exist')
    cy.get('[cy-test-id=logoutBtn]').should('be.visible')
    cy.logout()
  })

  it('does not log in an unverified user, sends email and displays message', () => {
    cy.get("[type='email']").type($unverified)
    cy.get("input#password").type($password)
    cy.intercept('**/identitytoolkit.googleapis.com/v1/accounts:sendOobCode*').as('requestVerification')
    cy.get('[cy-test-id=loginBtn]').click()
    cy.findByText(/verification email has been sent/,{ timeout: 3000 }).should('be.visible')
    cy.wait('@requestVerification').should(({ request, response }) => {
      console.log(request.body)
      expect(request.body).to.have.property(
        'requestType',
        'VERIFY_EMAIL'
      )
    })
  })

  it('does not allow email to be blank when Forgot Password is clicked', () => {
    cy.get('[cy-test-id=forgot-password]').click()
    cy.findByText(/an error occurred/, { timeout: 3000 }).should('be.visible')
  })
  
  it('does not log in if password is incorrect and displays error', () => {
    cy.get("[type='email']").type($email)
    cy.get("input#password").type('test')
    cy.get('[cy-test-id=loginBtn]').click()
    cy.get('.error').should('be.visible')
  })
})