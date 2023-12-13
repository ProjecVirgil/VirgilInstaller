import { useEffect, useState } from 'react'

function InstallationScene() {
  const [console_output, setConsole_output] = useState('')

  useEffect(() => {
    const handleOutput = (message) => {
      setConsole_output(message)
    }

    window.api.send('runcommand')
    window.api.receive('outputcommand', handleOutput)

  }, [console_output])

  return (
    <div>
      <h1 className="text-center text-[24px] m-3 mt-0">Installation in progress</h1>
      <div className="m-6 bg-black opacity-70 p-4">
        <p
          className="text-[13px] text-[#dddddf]"
          dangerouslySetInnerHTML={{ __html: console_output }}
        ></p>
      </div>
    </div>
  )
}
export default InstallationScene
