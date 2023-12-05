import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="virgil-theme">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
)
