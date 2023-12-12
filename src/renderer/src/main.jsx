import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import App from './App'
import LoadingScreen from './components/LoadingScreen'
import { createBrowserRouter } from 'react-router-dom'
// import { closeWindow } from 'electron';

const router = createBrowserRouter([
  // Add your routes here, e.g.,
  {
    path: '/',
    element: <App />
  }
])

const Root = () => {
  const [loading, setLoading] = useState(true)

  return (
    <React.StrictMode>
      <NextUIProvider>
        <main className="virgil-theme">
          {loading ? <LoadingScreen setIsLoading={setLoading} /> : <App />}
        </main>
      </NextUIProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
