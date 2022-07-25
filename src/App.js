// manages state for displayName which is sent as props to <Signup />

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthContext } from './hooks/useAuthContext'

// pages and components
import AddPerson from './pages/addPerson/AddPerson'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Person from './pages/person/Person'
import Navbar from './components/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import AddRelatives from './pages/addRelatives/AddRelatives'
import Search from './components/sidebar/Search'
import Faq from './pages/faq/Faq'

// styles
import './App.css'

function App() {
  
  const { user, authIsReady } = useAuthContext()
  
  let tempDisplayName = user ? user.displayName : ''
  const [sbDisplayName, setSbDisplayName] = useState('')
  console.log('in app after setDn', sbDisplayName,'tempname', tempDisplayName )
 
  const updateDisplayName = (newName) => {
    console.log('in updateDisplay Name', 'dn',sbDisplayName, 'nn', newName)
    setSbDisplayName(newName)
    console.log('after updateDisplay Name', sbDisplayName, 'nn', newName)
  }

  const displayNameProps = {
    sbDisplayName,
    updateDisplayName: (newName) => updateDisplayName(newName)
  }

   useEffect(() => {
     updateDisplayName(tempDisplayName)
   }, [user])

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
         <Sidebar sbDisplayName={sbDisplayName} />
         <div className="container">
           <Navbar />
           <Routes>
             <Route 
               path="/faq" 
               element={<Faq />} 
             />
             <Route 
               path="/" 
               element={user ? <Home /> : <Login />} 
             />
             <Route 
               path="/signup" 
               element={!user  ? <Signup {...displayNameProps}/> : <Home /> } 
             />
             <Route 
               path="/updateuser" 
               element={user ? <Signup {...displayNameProps}/> : <Login />} 
             />
             <Route 
               path="/login" 
               element={!user ? <Login /> : <Home />} 
             />
             <Route 
               path="/person/:id" 
               element={user ? <Person /> : <Login />} 
             />
             <Route 
               path="/updateperson/:id" 
               element={user ? <AddPerson /> : <Login />} 
             />
             <Route 
               path="/addperson" 
               element={user ? <AddPerson /> : <Login />} 
             />
             <Route 
               path="/addrelatives/:id"
               element={user ? <AddRelatives /> : <Login />}
             /> 
             <Route 
               path="/search"
               element={user ? <Search /> : <Login />}
             />
          </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
