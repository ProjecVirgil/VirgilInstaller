import { useEffect, useState, useRef } from 'react'

// Supponendo che queste importazioni siano corrette
import PendingIcon from './PendingIcon'
import ErrorIcon from '@mui/icons-material/Error'
import DoneIcon from './DoneIcon'

const command_list = ['echo ciao', 'echo mammt']

function InstallationScene() {
  const outputEndRef = useRef(null)
  const [list_task, setListTask] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)

  function addTask() {
    setListTask((prevLista) => [...prevLista, { status: 0 }])
  }

  function changeStatus(new_status, index) {
    setListTask((prev_list) => {
      const updated_list = [...prev_list]
      updated_list[index] = { ...updated_list[index], status: new_status }
      return updated_list
    })
  }

  useEffect(() => {
    // Funzione per gestire l'output del comando
    const handleOutput = () => {
      console.log('OUT')
      changeStatus(2, currentTaskIndex) // Imposta lo stato del task corrente su completato
      setCurrentTaskIndex((currentIndex) => currentIndex + 1) // Passa al task successivo
    }

    // Registra il listener per l'evento di output
    window.api.receive('outputcommand', handleOutput)

    // Esegue il task corrente
    function runCurrentTask() {
      if (currentTaskIndex < command_list.length) {
        addTask()
        changeStatus(1, currentTaskIndex)
        window.api.send('runcommand', command_list[currentTaskIndex])
      }
    }

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
                    <p className="mr-2 mb-1">Operazione numero: {index + 1} fatta</p>
                    <DoneIcon size="18px" />
                  </div>
                ) : (
                  <div className="flex">
                    <p className="mr-2 mb-1">Operazione numero: {index + 1} in attesa</p>
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
