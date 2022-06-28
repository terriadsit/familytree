import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from '../../src/pages/signup/Signup'

describe('Appears to a new user as it should', () => {
  it('contains all of the expected fields', () => {
    let displayNameProps = {
      updateDisplayName: ""
    }
    cy.mount(
      <BrowserRouter >
        <Routes>
          <Route 
               path="/signup" 
               element= {<Signup {...displayNameProps}/>}  
          />
        </Routes>
      </BrowserRouter>
      )
  })
})