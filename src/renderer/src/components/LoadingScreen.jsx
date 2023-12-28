import { useEffect, useState } from 'react'
import {
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'

const LoadingScreen = ({ setIsLoading }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [timeFinish, setTimeFinish] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const [isOk, setOk] = useState(false)

  useEffect(() => {
    const handleDownloadResponse = () => {}

    const open_modal = (message) => {
      if (message) {
        setModalOpened(true)
        onOpen()
      }
    }
    window.api.receiveOnce('imageDownloadError', handleDownloadResponse)
    window.api.receiveOnce('result_check', open_modal)

    window.api.send('search_update')
    window.api.send('downloadImage')
  }, [])

  const stopLoading = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => setTimeFinish(true), 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (modalOpened && isOk) {
      if (timeFinish) {
        stopLoading()
      }
    } else {
      if (!modalOpened && timeFinish) {
        stopLoading()
      }
    }
  }, [modalOpened, timeFinish, isOk, isOpen])

  return (
    <div className="loading-container h-screen">
      <div className="loader">
        <Spinner label="Loading..." color="primary" size="lg" />
      </div>

      <Modal
        placement="center"
        backdrop="blur"
        className="bg-[#1d1e27]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                WARNING OLD VERSION INSTALLED
              </ModalHeader>
              <ModalBody>
                <p>
                  You have an old version of this installer on your computer, install the latest
                  version with this{' '}
                  <a
                    className="underline text-[#a58ef5]"
                    href="https://github.com/ProjecVirgil/VirgilInstaller/releases"
                  >
                    link
                  </a>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#a58ef5]"
                  variant="dark"
                  onPress={() => {
                    onClose()
                    setOk(true)
                  }}
                >
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default LoadingScreen
