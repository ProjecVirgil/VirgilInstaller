import React from 'react'
import { Button, Snippet, Tooltip, Checkbox } from '@nextui-org/react'
import QuestionMarkIcon from './QuestionMarkicon'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react'

function GScene() {
  const [isSelectedG1, setIsSelectedG1] = React.useState(true)
  const [isSelectedG2, setIsSelectedG2] = React.useState(false)
  const [isSelectedG3, setIsSelectedG3] = React.useState(true)
  const [isSelectedG4, setIsSelectedG4] = React.useState(false)
  const [isSelectedG5, setIsSelectedG5] = React.useState(true)
  const [isSelectedG6, setIsSelectedG6] = React.useState(false)
  const [isSelectedG7, setIsSelectedG7] = React.useState(true)
  const [isSelectedG8, setIsSelectedG8] = React.useState(false)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedPath, setSelectedPath] = React.useState('')

  const selectPath = () => {
    window.api.send('open-file-dialog')
  }

  React.useEffect(() => {
    window.api.receive('selected-directory', (path) => {
      setSelectedPath(path)
    })
  }, [])

  function shorting_the_path(string) {
    let list = string.split('\\')
    console.log(list.length)
    return list[0] + '/' + list[1] + '/.../' + list[list.length - 1]
  }

  return (
    <div>
      <h1 className="text-center text-[24px] m-3 mt-0"> Initial configuration </h1>
      <div className="w-[50%] float-left">
        <div className="div_check">
          <Tooltip
            showArrow={true}
            delay={300}
            color="default"
            className="blur_tooltip"
            placement="right"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Automatic start-up of Virgil</div>
                <div className="text-tiny">
                  If you enable this option virgilio will start up together with your operating
                  system
                </div>
              </div>
            }
          >
            <h1 className="subtitle mb-2 w-[100px]">Startup app?</h1>
          </Tooltip>
          <div className="parentG">
            <div className="div1G">
              <Checkbox
                isSelected={isSelectedG1}
                onValueChange={() => {
                  setIsSelectedG1(!isSelectedG1)
                  setIsSelectedG2(!isSelectedG2)
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG2}
                onValueChange={() => {
                  setIsSelectedG1(!isSelectedG1)
                  setIsSelectedG2(!isSelectedG2)
                }}
              >
                <p className="text-[13px]">No</p>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="div_check">
          <Tooltip
            showArrow={true}
            color="default"
            delay={300}
            className="blur_tooltip"
            placement="right"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">You can specify the interface of startup</div>
                <div className="text-tiny">
                  You can decide whether to start a precise input interface automatically without
                  choosing every time you start your Virgil
                </div>
              </div>
            }
          >
            <h1 className="subtitle mb-2 w-[130px]">Specify interface?</h1>
          </Tooltip>
          <div className="parentG">
            <div className="div1G">
              <Checkbox
                isSelected={isSelectedG3}
                onValueChange={() => {
                  setIsSelectedG3(!isSelectedG3)
                  setIsSelectedG4(!isSelectedG4)
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG4}
                onValueChange={() => {
                  setIsSelectedG3(!isSelectedG3)
                  setIsSelectedG4(!isSelectedG4)
                }}
              >
                <p className="text-[13px]">No</p>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="div_check">
          <Tooltip
            delay={300}
            showArrow={true}
            color="default"
            className="blur_tooltip"
            placement="right"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Text interface or Vocal interface</div>
                <div className="text-tiny">
                  Specify the interface to be used as default, textual or vocal?
                </div>
              </div>
            }
          >
            <h1 className="subtitle mb-2 w-[110px]">Type interface: </h1>
          </Tooltip>
          <div className="parentG">
            <div className="div1G">
              <Checkbox
                isDisabled={isSelectedG3 ? false : true}
                isSelected={isSelectedG5}
                onValueChange={() => {
                  setIsSelectedG5(!isSelectedG5)
                  setIsSelectedG6(!isSelectedG6)
                }}
              >
                <p className="text-[13px]">Text</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isDisabled={isSelectedG3 ? false : true}
                isSelected={isSelectedG6}
                onValueChange={() => {
                  setIsSelectedG5(!isSelectedG5)
                  setIsSelectedG6(!isSelectedG6)
                }}
              >
                <p className="text-[13px]">Vocal</p>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[50%] float-right">
        <div className="div_check">
          <Tooltip
            delay={300}
            showArrow={true}
            color="default"
            className="blur_tooltip"
            placement="left"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">The path for the installation of Virgil</div>
                <div className="text-tiny">The default path is C:\Program Files</div>
              </div>
            }
          >
            <h1 className="subtitle mb-2">Installation path</h1>
          </Tooltip>
          <div className="parentG2">
            <div className="div1G">
              <Button
                color="primary"
                variant="ghost"
                className="w-[200px] h-7"
                onClick={selectPath}
              >
                {selectedPath ? (
                  <p className="text-[12px]">{shorting_the_path(selectedPath)}</p>
                ) : (
                  <p>Select the path of installation</p>
                )}
              </Button>
            </div>
            <div className="div2G"></div>
          </div>
        </div>

        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[130px]">Icon on desktop?</h1>
            <div className="w-5">
              <Button
                onPress={onOpen}
                className="bg-[#a58ef5] h-5 min-w-unit-5 w-5 p-1 rounded-[40px] mt-[3px]"
              >
                <QuestionMarkIcon width="12px" height="12px" />
              </Button>
            </div>
          </div>

          <div className="parentG2">
            <div className="div1G">
              <Checkbox
                isSelected={isSelectedG7}
                onValueChange={() => {
                  setIsSelectedG7(!isSelectedG7)
                  setIsSelectedG8(!isSelectedG8)
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG8}
                onValueChange={() => {
                  setIsSelectedG7(!isSelectedG7)
                  setIsSelectedG8(!isSelectedG8)
                }}
              >
                <p className="text-[13px]">No</p>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="div_check">
          <Tooltip
            delay={300}
            showArrow={true}
            color="default"
            className="blur_tooltip"
            placement="left"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">The MOST imporant KEY</div>
                <div className="text-tiny">
                  With this key you can configure all the settings for your Virgil via mobile app;
                  For more info see{' '}
                  <a
                    target="_blank"
                    href="https://github.com/ProjecVirgil/VirgilAI"
                    rel="noreferrer"
                  >
                    https://github.com/ProjecVirgil/VirgilAI
                  </a>
                </div>
              </div>
            }
          >
            <h1 className="subtitle mb-2">Your config key:</h1>
          </Tooltip>
          <Snippet color="primary" size="sm" className="w-[100%] text-[10px]">
            174766dce532f7419fdff60d8ff6574e
          </Snippet>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                  deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GScene
