import { Spinner } from '@nextui-org/react'
import { useEffect } from 'react'

const LoadingScreen = () => {

  useEffect(() => {
    const handleDownloadResponse = (event, message) => {
      console.log(message)
    }

    window.api.receive('imageDownloaded', handleDownloadResponse)
    window.api.receive('imageDownloadError', handleDownloadResponse)

    window.api.send('downloadImage')

  }, [])

  return (
    <div className="loading-container">
      <div className="loader">
        <Spinner label="Loading..." color="primary" size="lg" />
      </div>
    </div>
  )
}

export default LoadingScreen
