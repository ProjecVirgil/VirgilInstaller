import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import App from './App'
import { createBrowserRouter } from 'react-router-dom'
//import { closeWindow } from 'electron';

const router = createBrowserRouter([
  // Add your routes here, e.g.,
  {
    path: '/',
    element: <App />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="virgil-theme">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
)
