import React from 'react'
import { createRoot } from 'react-dom/client'
import Mom from './Mom'
import './styles.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <React.StrictMode>
    <Mom />
  </React.StrictMode>
)
