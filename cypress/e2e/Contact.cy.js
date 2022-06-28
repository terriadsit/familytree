describe('contains and requires correct fields, send behaves correctly', () => {
  
  beforeEach(() => {
    cy.login()
    cy.visit('/faq')
  })

  it('displays and requires correct fields, button', () => {
    cy.get(".contact-form > input[name='name']").should('have.attr', 'required')
    cy.get(".contact-form > input[name='email']").should('have.attr','type','email')
    cy.get(".contact-form > input[name='email']").should('have.attr', 'required')
    cy.get(".contact-form > input[name='subject']").should('have.attr', 'required')
    cy.get("textarea").should('have.attr', 'required')
    cy.get(".contact-form > .btn").should('have.attr', 'value','Send')
  })

  it('send button sends request and notifies user', () => {
    cy.get(".contact-form > input[name='name']").type('test name')
    cy.get(".contact-form > input[name='email']").type('test12qowg@mailinator.com')
    cy.get(".contact-form > input[name='subject']").type('test subject')
    cy.get("textarea").type('test textarea')
    cy.intercept('**/email/send-form').as('emailSent')
    cy.get(".contact-form > .btn").click()
    cy.findByText(/Thank you for your message!/, { timeout: 1000 }).should('be.visible')
    cy.wait('@emailSent').should(({ request, response }) => {
      console.log('request',JSON.stringify(request.body))
      console.log('response',response)
      expect(JSON.stringify(request.body)).to.have.string('test name')
      expect(JSON.stringify(request.body)).to.have.string('test12qowg@mailinator.com')
      expect(JSON.stringify(request.body)).to.have.string('test subject')
      expect(JSON.stringify(request.body)).to.have.string('test textarea')
      
    })
  })

  afterEach(() => {
    cy.logout()
  })
})