import ToggleSwitch from '../../src/components/ToggleSwitch'
import updateMyPersons from '../../src/manageFileStorage/updateMyPersons'

describe('ToggleSwitch.cy.js', () => {

  
  let onHome = false
  // allow user to be added to home page
  const toggleProps = {
    label: '',
    checked: onHome,
    handleToggle: (onHome) => handleToggle(onHome) 
  }

  // check if user has this person on their home page,  
  // pass props to <ToggleSwitch /> to indicate
  

  // called by <ToggleSwitch /> by props to update home page of user
  const handleToggle = (onHome) => {
    // remove or add to users list of home page persons, MyPersons
    if (onHome) {
      console.log(TEST_UID, PERSON_ID,  'add')
      //updateMyPersons(TEST_UID, PERSON_ID,  'add')
    } else {
      console.log(TEST_UID, PERSON_ID,  'remove')
      //updateMyPersons(TEST_UID, PERSON_ID,  'remove')
    }
  }

  it('should add or remove a person from the users home page', () => {
    cy.login()
    cy.mount(<ToggleSwitch {...toggleProps}/>)
  })
})