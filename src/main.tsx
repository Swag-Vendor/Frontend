import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-ignore: allow CSS side-effect import without type declarations
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
