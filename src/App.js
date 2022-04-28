import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages and components
import AddPerson from './pages/addPerson/AddPerson'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Person from './pages/person/Person'
import UpdatePerson from './pages/updatePerson/UpdatePerson'
import Navbar from './components/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import AddRelatives from './pages/addRelatives/AddRelatives'

// styles
import './App.css'

function App() {
  const { user, authIsReady } = useAuthContext()
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
         <Sidebar />
         <div className="container">
           <Navbar />
           <Routes>
             <Route 
               path="/" 
               element={user ? <Home /> : <Login />} 
             />
             <Route 
               path="/signup" 
               element={!user ? <Signup /> : <Home /> } 
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
           </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
