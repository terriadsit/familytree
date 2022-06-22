import Contact from '../../src/components/Contact'

describe('Test Contact UI', () => {
  it('should contain email, subject and content', () => {
    cy.mount(
      <Contact />
    )
  })
})
