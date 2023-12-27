import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import App from './App'
import LoadingScreen from './components/LoadingScreen'
import { getJSON, setJSON } from './utils/JsonManager'
import { MainContext } from './context/MainContext'
import ModifyInstallationScene from './components/ModifyInstallationScene'

const Root = () => {
  const [loading, setLoading] = useState(true)
  const [first_start, setFirstStart] = useState('')
  const [config, setConfig] = useState(null)

  useEffect(() => {
    let isMounted = true

    getJSON('config.json')
      .then((data) => {
        if (isMounted) {
          setFirstStart(data.first_start)
          data.first_start = false
          setJSON('config.json', data)
          setConfig(data)
        }
      })
      .catch((error) => {
        console.error('Error during the load of config', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <MainContext.Provider value={{ config, setConfig }}>
      <React.StrictMode>
        <NextUIProvider>
          <main className="virgil-theme">
            {loading ? (
              <LoadingScreen setIsLoading={setLoading} />
            ) : first_start ? (
              <App />
            ) : (
              <ModifyInstallationScene></ModifyInstallationScene>
            )}
          </main>
        </NextUIProvider>
      </React.StrictMode>
    </MainContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
