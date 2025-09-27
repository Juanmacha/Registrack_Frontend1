import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/responsive.css'
import './styles/fullcalendar-custom.css'
import './styles/alertAnimations.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import { setupErrorFilter } from './utils/errorFilter.js'

// Configurar filtro de errores de extensiones del navegador
setupErrorFilter();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
