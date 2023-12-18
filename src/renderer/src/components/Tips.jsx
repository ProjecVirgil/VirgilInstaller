import QuestionMarkIcon from './Icons/QuestionMarkicon'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'

function Tips(props) {
  const { header, content } = props
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div>
      <Button
        onPress={onOpen}
        className="bg-[#a58ef5] h-5 min-w-unit-5 w-5 p-1 rounded-[40px] mt-[3px]"
      >
        <QuestionMarkIcon width="12px" height="12px" />
      </Button>
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
              <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
              <ModalBody>
                <p>{content}</p>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#a58ef5]" variant="dark" onPress={onClose}>
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

export default Tips
