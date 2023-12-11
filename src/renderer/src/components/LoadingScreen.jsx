import { Spinner } from '@nextui-org/react'

const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loader">
      <Spinner label="Loading..." color="primary" size="lg" />
    </div>
  </div>
)

export default LoadingScreen
