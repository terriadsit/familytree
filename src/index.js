import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>

    <AuthContextProvider>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);