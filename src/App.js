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
import Contact from './components/Contact'


// styles
import './App.css'

function App() {
  
  const { user, authIsReady } = useAuthContext()
  const [displayName, setDisplayName] = useState('')
  let tempDisplayName = user ? user.displayName : ''
  console.log('app display name', displayName)

  const updateDisplayName = (newName) => {
    setDisplayName(newName)
  }

  const displayNameProps = {
    displayName,
    updateDisplayName: (newName) => updateDisplayName(newName)
  }

   useEffect(() => {
     setDisplayName(tempDisplayName)
   }, [tempDisplayName])

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
         <Sidebar {...displayNameProps}/>
         <div className="container">
           <Navbar />
           <Routes>
             <Route 
               path="/contact" 
               element={<Contact />} 
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
