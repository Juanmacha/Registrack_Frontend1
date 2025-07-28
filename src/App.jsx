import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/authContext.jsx';
import AppRoutes from './routes/routes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
