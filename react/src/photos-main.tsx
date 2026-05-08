import React from 'react'
import { createRoot } from 'react-dom/client'
import Photos from './Photos.tsx'
import './styles.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <React.StrictMode>
    <Photos />
  </React.StrictMode>
)
