import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/responsive.css'
import './styles/fullcalendar-custom.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import { PaymentProvider } from './shared/contexts/PaymentContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaymentProvider>
      <App />
    </PaymentProvider>
  </StrictMode>,
)
