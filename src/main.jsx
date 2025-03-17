import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import DarkModeToggle from './components/DarkModeToggle';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeToggle /> 
    <App />
  </StrictMode>,
)
