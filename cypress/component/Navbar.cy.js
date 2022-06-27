import Navbar from '../../src/components/Navbar'

describe('Navbar component tests', () => {
  it('has correct links when not logged in', () => {
    cy.mount(<Navbar />)
  })
})