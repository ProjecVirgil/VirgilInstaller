import { useState, useEffect } from 'react'
import { Button, Snippet, Checkbox } from '@nextui-org/react'
//import SelectOption from './SelectOptions'
import Tip from './Tips'

function GScene() {
  const [isSelectedG1, setIsSelectedG1] = useState(true)
  const [isSelectedG2, setIsSelectedG2] = useState(false)
  const [isSelectedG3, setIsSelectedG3] = useState(true)
  const [isSelectedG4, setIsSelectedG4] = useState(false)
  const [isSelectedG5, setIsSelectedG5] = useState(true)
  const [isSelectedG6, setIsSelectedG6] = useState(false)
  const [isSelectedG7, setIsSelectedG7] = useState(true)
  const [isSelectedG8, setIsSelectedG8] = useState(false)

  const [selectedPath, setSelectedPath] = useState('')

  const selectPath = () => {
    window.api.send('open-file-dialog')
  }

  useEffect(() => {
    window.api.receive('selected-directory', (path) => {
      setSelectedPath(path)
    })
  }, [])

  function shorting_the_path(string) {
    if (string.includes('\\')) {
      let list = string.split('\\')
      return list[0] + '\\' + list[1] + '\\...\\' + list[list.length - 1]
    } else {
      let list = string.split('/')
      return list[0] + '/' + list[1] + '/.../' + list[list.length - 1]
    }
  }

  return (
    <div>
      <h1 className="text-center text-[24px] m-3 mt-0"> Initial configuration </h1>

      <div className="w-[50%] float-left">

        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[90px] mr-2">Startup app?</h1>
            <div className="w-5">
              <Tip
                header="Automatic start-up of Virgil"
                content="If you enable this option virgilio will start up together with your operating
                  system"
              ></Tip>
            </div>
          </div>
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
          <div className="flex">
            <h1 className="subtitle mb-2 w-[130px] mr-2">Specify interface?</h1>
            <div className="w-5">
              <Tip
                header="You can specify the interface of startup"
                content="You can decide whether to start a precise input interface automatically without
                  choosing every time you start your Virgil"
              ></Tip>
            </div>
          </div>
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
          <div className="flex">
            <h1 className="subtitle mb-2 w-[110px] mr-2">Type interface: </h1>
            <div className="w-5">
              <Tip
                header="Text interface or Vocal interface"
                content="Specify the interface to be used as default, textual or vocal?
"
              ></Tip>
            </div>
          </div>
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
          <div className="flex">
            <h1 className="subtitle mb-2 w-[120px] mr-2">Installation path</h1>
            <div className="w-5">
              <Tip
                header="The path for the installation of Virgil"
                content="The default path is C:\Program Files"
              ></Tip>
            </div>
          </div>

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
                  <p>C:/Programs</p>
                )}
              </Button>
            </div>
            <div className="div2G w-[20px]"></div>
          </div>
        </div>

        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[130px]">Icon on desktop?</h1>
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
            <div className="div2G w-[20px]">
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
          <div className="flex">
            <h1 className="subtitle mb-2 w-[130px]">Your config key:</h1>
            <div className="w-5">
              <Tip
                header="The MOST important KEY"
                content={
                  <div>
                    <div className="text-tiny">
                      With this key you can configure all the settings for your Virgil via mobile
                      app; For more info see{' '}
                      <a
                        className="underline text-[#a58ef5]"
                        target="_blank"
                        href="https://github.com/ProjecVirgil/VirgilAI"
                        rel="noreferrer"
                      >
                        https://github.com/ProjecVirgil/VirgilAI
                      </a>
                    </div>
                  </div>
                }
              ></Tip>
            </div>
          </div>
          <Snippet color="primary" size="sm" className="w-[100%] text-[10px]">
            174766dce532f7419fdff60d8ff6574e
          </Snippet>
        </div>
      </div>
    </div>
  )
}

export default GScene
