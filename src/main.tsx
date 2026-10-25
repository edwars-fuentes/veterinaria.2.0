import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
<<<<<<< HEAD
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
=======
>>>>>>> 8e2bc1117fc00d867bdaa4fb862838fbae15d60d
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </StrictMode>,
)
