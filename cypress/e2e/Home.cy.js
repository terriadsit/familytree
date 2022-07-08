import sortPeopleByBD from '../../src/sharedFunctions/sortPeopleByBD'
import getAUser from '../../src/manageFileStorage/getAUser'
import getPeopleFromIds from '../../src/manageFileStorage/getPeopleFromIds'

describe('Home Page appears and acts correctly', () => {
  const uid = Cypress.env('TEST_UID')
  let peopleIds = []
  let orderedPeople = []

  function getPeopleByBirthdate () {
    getAUser(uid)
      .then(user => {
        console.log('user', user)
        user.myPersons.map(p => {
          peopleIds.push(p.personId)
          console.log('mapping', p)
        })
        return peopleIds
      })
      .then(res => {
        let people = getPeopleFromIds(res)
        return people
      })
      .then(people => {
        console.log('response', people)
        orderedPeople = sortPeopleByBD(people)
      })
  }

  before(() => {
    cy.login()
    cy.visit('/')
    cy.wait(5000)
  })

  it('ordered by birthdate, contains all those who this user chose to be on home page', () => {
    getPeopleByBirthdate()
    cy.wait(5000)
    cy.get('.person-list > a > h4').each(($el, index) => {
      cy.wrap($el).should('contain.text', orderedPeople[index].name)
    })
  })

  it('clicking on a person links to that persons page', () => {
    cy.get('div:nth-of-type(1) > a > h4')
    .then(($title) => {
      const txt = $title.text()
      cy.wrap($title).click()
      cy.get('[cy-test-id=person-name]').should(($title2) => {
        expect($title2.text()).to.eq(txt)
      })
    })
  })

  after(() => {
    cy.logout()
  })
})
