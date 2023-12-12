import Welcome from './WelcomeScene'
import { ScrollShadow } from '@nextui-org/react'
import License from './LicenseScene'
import ConfigScene from './ConfigScene'
import { useRef, useEffect } from 'react'

function Main(props) {
  const step = props.step
  const scrollRef = useRef(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const reminderListener = () => {
      scrollToBottom()
    }
    window.api.receive('reminder', reminderListener)
  }, [])

  const content = () => {
    if (step == 0) {
      return <Welcome></Welcome>
    } else if (step == 1) {
      return <License></License>
    } else if (step == 2) {
      return <ConfigScene></ConfigScene>
    } else if (step == 3) {
      return <h1>Installazione</h1>
    }
  }

  return (
    <div className="main">
      <ScrollShadow
        ref={scrollRef}
        offset={100}
        size={20}
        hideScrollBar
        className="w-[100%] h-[99%] rounded-[24px] p-5 change_font scroll-smooth"
      >
        {content()}
      </ScrollShadow>
    </div>
  )
}

export default Main
