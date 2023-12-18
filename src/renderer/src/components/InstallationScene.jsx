import { useEffect, useState, useRef } from 'react'

import PendingIcon from './Icons/PendingIcon'
import ErrorIcon from './Icons/ErrorIcons'
import DoneIcon from './Icons/DoneIcon'

const command_list = ['echo ciao', 'echo mammt', 'echo alessia', 'echo wow']
const tasks_name = ['Installa Alessia', 'Compila Alessia', 'Esegui Alessia', 'Viva Alessia']

function InstallationScene() {
  const outputEndRef = useRef(null)
  const [list_task, setListTask] = useState([
    { status: 0 },
    { status: 0 },
    { status: 0 },
    { status: 0 }
  ])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)

  function changeStatus(new_status, index) {
    setListTask((prev_list) => {
      const updated_list = [...prev_list]
      updated_list[index] = { ...updated_list[index], status: new_status }
      return updated_list
    })
  }

  useEffect(() => {
    const handleOutput = (data) => {
      if (data.includes('error')) {
        changeStatus(-1, currentTaskIndex);
      } else {
        changeStatus(2, currentTaskIndex);
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    }
    function runCurrentTask() {
      if (currentTaskIndex < command_list.length) {
        changeStatus(1, currentTaskIndex)
        window.api.send('runcommand', command_list[currentTaskIndex])
      }
    }

    window.api.receiveOnce('outputcommand', handleOutput)
    runCurrentTask()
  }, [currentTaskIndex])

  return (
    <div>
      <h1 className="text-center text-[24px] m-3 mt-0">Installation in progress</h1>
      <div className="m-6 bg-black opacity-70 p-4">
        <ul className="text-[13px] text-[#dddddf]">
          {list_task.map((item, index) => (
            <li key={index}>
              <div>
                {item.status === 2 ? (
                  <div className="flex">
                    <p className="mr-2 mb-1">{tasks_name[index]} done</p>
                    <DoneIcon size="18px" />
                  </div>
                ) : item.status === -1 ? (
                  <div className="flex">
                    <p className="mr-2 mb-1">{tasks_name[index]} error</p>
                    <ErrorIcon size="17px" />
                  </div>
                ) : (
                  <div className="flex">
                    <p className="mr-2 mb-1">{tasks_name[index]} in pending</p>
                    <PendingIcon size="17px" />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div ref={outputEndRef} />
      </div>
    </div>
  )
}

export default InstallationScene
