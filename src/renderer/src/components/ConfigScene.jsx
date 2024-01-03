import { useState, useEffect, useContext, useMemo } from 'react'
import { MainContext } from '../context/MainContext'
import { Button, Checkbox, Input } from '@nextui-org/react'
import { setJSON } from '../utils/JsonManager'
import Tip from './Tips'

function ConfigScene(props) {
  const { label } = props
  const { config, setConfig } = useContext(MainContext)
  const [value, setValue] = useState(config.key)

  //Startup
  const [isSelectedG1, setIsSelectedG1] = useState(true) //YES
  const [isSelectedG2, setIsSelectedG2] = useState(false) //NO

  //Specify
  const [isSelectedG3, setIsSelectedG3] = useState(false) //YES
  const [isSelectedG4, setIsSelectedG4] = useState(true) //NO

  //Type Interface
  const [isSelectedG5, setIsSelectedG5] = useState(true) //TEXT
  const [isSelectedG6, setIsSelectedG6] = useState(false) //VOCAL

  //Icon on desktop
  const [isSelectedG7, setIsSelectedG7] = useState(true) //YES
  const [isSelectedG8, setIsSelectedG8] = useState(false) //NO

  //Display console
  const [isSelectedG9, setIsSelectedG9] = useState(true) //YES
  const [isSelectedG10, setIsSelectedG10] = useState(false) //NO

  const [selectedPath, setSelectedPath] = useState('')

  useEffect(() => {
    if (config.startup) {
      setIsSelectedG1(true)
      setIsSelectedG2(false)
    } else {
      setIsSelectedG1(false)
      setIsSelectedG2(true)
    }

    if (config.specify_interface) {
      setIsSelectedG3(true)
      setIsSelectedG4(false)
    } else {
      setIsSelectedG3(false)
      setIsSelectedG4(true)
    }

    if (config.installation_path) {
      setSelectedPath(config.installation_path)
    }

    if (config.icon_on_desktop) {
      setIsSelectedG7(true)
      setIsSelectedG8(false)
    } else {
      setIsSelectedG7(false)
      setIsSelectedG8(true)
    }
  }, [])

  const selectPath = () => {
    window.api.send('open-file-dialog')
  }

  useEffect(() => {
    if (!isSelectedG3) {
      setConfig((prevConfig) => ({ ...prevConfig, type_interface: 'N' }))
    } else {
      if (isSelectedG5) {
        setConfig((prevConfig) => ({ ...prevConfig, type_interface: 'T' }))
      } else if (isSelectedG6) {
        setConfig((prevConfig) => ({ ...prevConfig, type_interface: 'V' }))
      }
    }
  }, [isSelectedG3])

  useEffect(() => {
    window.api.receiveOnce('selected-directory', (path) => {
      setSelectedPath(path)
      setConfig((prevConfig) => ({ ...prevConfig, installation_path: path }))
    })
  }, [])

  useEffect(() => {
    setConfig((prevConfig) => ({ ...prevConfig, key: value.toLowerCase() }))
  }, [value])

  useEffect(() => {
    setJSON('config.json', config)
  }, [config])

  function shorting_the_path(string) {
    if (string.includes('\\')) {
      let list = string.split('\\')
      return list[0] + '\\' + list[1] + '\\...\\' + list[list.length - 1]
    } else {
      let list = string.split('/')
      return list[0] + '/' + list[1] + '/.../' + list[list.length - 1]
    }
  }

  const isInvalid = useMemo(() => {
    if (value === '') return false
    const validateKey = (value) => value.match(/^[a-f0-9]{32}$/i)
    return validateKey(value) ? false : true
  }, [value])

  return (
    <div>
      <h1 className="text-center text-[24px] m-3 mt-0"> {label} </h1>

      <div className="w-[50%] float-left">
        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[90px] mr-2">Startup app?</h1>
            <div className="w-5">
              <Tip
                header="Automatic start-up of Virgil"
                content="If you enable this option Virgil will start up together with your operating
                  system"
              ></Tip>
            </div>
          </div>
          <div className="parentG">
            <div className="div1G">
              <Checkbox
                isSelected={isSelectedG1}
                onValueChange={() => {
                  setIsSelectedG1(true)
                  setIsSelectedG2(false)
                  setConfig((prevConfig) => ({ ...prevConfig, startup: true }))
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG2}
                onValueChange={() => {
                  setIsSelectedG1(false)
                  setIsSelectedG2(true)
                  setConfig((prevConfig) => ({ ...prevConfig, startup: false }))
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
                  setIsSelectedG3(true)
                  setIsSelectedG4(false)
                  setConfig((prevConfig) => ({ ...prevConfig, specify_interface: true }))
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG4}
                onValueChange={() => {
                  setIsSelectedG3(false)
                  setIsSelectedG4(true)
                  setConfig((prevConfig) => ({ ...prevConfig, specify_interface: false }))

                  setConfig((prevConfig) => ({ ...prevConfig, display_console: true }))
                  setIsSelectedG9(true)
                  setIsSelectedG10(false)
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
                  setIsSelectedG5(true)
                  setIsSelectedG6(false)
                  setConfig((prevConfig) => ({ ...prevConfig, type_interface: 'T' }))
                  setConfig((prevConfig) => ({ ...prevConfig, display_console: true }))
                  setIsSelectedG9(true)
                  setIsSelectedG10(false)
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
                  setIsSelectedG5(false)
                  setIsSelectedG6(true)
                  setConfig((prevConfig) => ({ ...prevConfig, type_interface: 'V' }))
                }}
              >
                <p className="text-[13px]">Vocal</p>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[150px] mr-2">Display the console?</h1>
            <div className="w-5">
              <Tip
                header="You can specify if display the console or not"
                content="In practice it will run Virgilio in the background but this option is only available if the chosen interface is Vocale and if it does not have to be specified at start-up"
              ></Tip>
            </div>
          </div>
          <div className="parentG">
            <div className="div1G">
              <Checkbox
                isSelected={isSelectedG9}
                isDisabled={isSelectedG3 && isSelectedG6 ? false : true}
                onValueChange={() => {
                  setIsSelectedG9(true)
                  setIsSelectedG10(false)
                  setConfig((prevConfig) => ({ ...prevConfig, display_console: true }))
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G">
              <Checkbox
                isSelected={isSelectedG10}
                isDisabled={isSelectedG3 && isSelectedG6 ? false : true}
                onValueChange={() => {
                  if (isSelectedG3 && isSelectedG6) {
                    setIsSelectedG9(false)
                    setIsSelectedG10(true)
                    setConfig((prevConfig) => ({ ...prevConfig, display_console: false }))
                  }
                }}
              >
                <p className="text-[13px]">No</p>
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
                content="The default path is C:Users\user\AppData\Local\Programs"
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
                  setIsSelectedG7(true)
                  setIsSelectedG8(false)
                  setConfig((prevConfig) => ({ ...prevConfig, icon_on_desktop: true }))
                }}
              >
                <p className="text-[13px]">Yes</p>
              </Checkbox>
            </div>
            <div className="div2G w-[20px]">
              <Checkbox
                isSelected={isSelectedG8}
                onValueChange={() => {
                  setIsSelectedG7(false)
                  setIsSelectedG8(true)
                  setConfig((prevConfig) => ({ ...prevConfig, icon_on_desktop: false }))
                }}
              >
                <p className="text-[13px]">No</p>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="div_check">
          <div className="flex">
            <h1 className="subtitle mb-2 w-[180px]">You will generate a key?</h1>
            <div className="w-5">
              <Tip
                header="The MOST important KEY"
                content={
                  <div>
                    <div className="text-[16px] leading-relaxed">
                      With this key, you can configure all the settings for your Virgil via the
                      mobile app. For more information, see{' '}
                      <a
                        className="underline text-[#a58ef5] hover:text-[#b59ff6]"
                        target="_blank"
                        href="https://github.com/ProjecVirgil/VirgilAI"
                        rel="noreferrer"
                      >
                        VirgilAI
                      </a>
                      .
                      <br />
                      <br />
                      <div className="text-[14px]">
                        You have the option to either generate the key or use a personal key. If you
                        enter a <strong className="font-semibold">null</strong> or{' '}
                        <strong className="font-semibold">invalid key</strong>, the key will be
                        generated automatically.
                      </div>
                    </div>
                  </div>
                }
              ></Tip>
            </div>
          </div>
          <div className="parentG2">
            <Input
              description="For more info click the '?' "
              classNames={{
                base: 'w-[41vw] mt-2',
                label: 'text-black/50 dark:text-white/90',
                input: [
                  'bg-transparent',
                  'text-black/90 dark:text-white/90',
                  'placeholder:text-default-700/50 dark:placeholder:text-white/60'
                ],
                innerWrapper: 'bg-transparent',
                inputWrapper:
                  'shadow-xl border-[#a58ef5] border-1 bg-[#333544] backdrop-blur-xl backdrop-saturate-200 caret-[#a58ef5] !cursor-text'
              }}
              label="Virgil key"
              placeholder="key"
              isInvalid={isInvalid}
              errorMessage={isInvalid && 'Please enter a valid key'}
              value={value}
              defaultValue={value}
              onValueChange={setValue}
            ></Input>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigScene
