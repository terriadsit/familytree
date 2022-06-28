describe('FAQ page looks correct and allows contact for those logged in or not logged in', () => {
  beforeEach(() => {
    cy.visit('/faq')
  })
  
  function appearsCorrect() {
    cy.get('.heading').should('contain.text', 'Frequently Asked Questions')
    cy.get('.contact > b').should('contain.text', 'Contact Us:')
  }

  it('appears correct to logged in users', () => {
    cy.login()
    appearsCorrect()
    cy.logout()
  })

  it('allows logged in users to access contact form, not tool tip', () => {
    cy.login()
    cy.visit('/faq')
    cy.get('.contact-form').should('be.visible')
    cy.get('.contact > b').trigger('mouseover')
      .then(() => {
        cy.get('.tip').should('not.exist')
      })
    cy.logout()
  })

  it('appears correct to those not logged in', () => {
    appearsCorrect()
  })

  it('allows those not logged in to access tooltip, not contact form', () => {
    cy.get('.contact > b').trigger('mouseover')
      .then(() => {
        cy.get('.tip').should('be.visible')
      })
    cy.get('.contact-form').should('not.exist')
  })


})