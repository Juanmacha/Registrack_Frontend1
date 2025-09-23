import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/authContext.jsx';
import { NotificationProvider } from './shared/contexts/NotificationContext.jsx';
import { PaymentProvider } from './shared/contexts/PaymentContext';
import AppRoutes from './routes/routes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <PaymentProvider>
            <AppRoutes />
          </PaymentProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
