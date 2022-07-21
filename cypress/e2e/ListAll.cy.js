import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { dbFirestore } from "../../src/firebase/config"

describe('Lists all of the persons in the people db', () => {
  let people = []
    
  async function getDb() {
    const q = query(collection(dbFirestore, "people"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().name);
      people.push(doc.data().name)
   });
   console.log('people', people)
  }

  before(() => {
    getDb()

  })
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.wait(5000)
  })
  it('list all of the people', () => {
    cy.get('.person-in-list').then(res => console.log(res))
      .each(($el, index) => {
        cy
        .wrap($el)
        .should('contain.text', people[index])
    } )
  })
  afterEach(() => {
    cy.logout()
  })
})