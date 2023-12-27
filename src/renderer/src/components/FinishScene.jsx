import { ScrollShadow } from '@nextui-org/react'
import gif from '../assets/img/giphy.gif'
import { useContext } from 'react'
import { MainContext } from '../context/MainContext'
function FinishScene() {
  const { config, setConfig } = useContext(MainContext)

  return (
    <div>
      <div className="main">
        <ScrollShadow
          offset={100}
          size={20}
          className="w-[100%] h-[99%] rounded-[24px] p-5 change_font scroll-smooth "
        >
          <h1 className="text-center text-[20px]">INSTALLATION COMPLETE</h1>
          <p>
            Ok now you follow the guide on this{' '}
            <a
              className="text-link"
              href="https://github.com/ProjecVirgil/VirgilAI?tab=readme-ov-file#guide-to-online-settings"
            >
              link
            </a>{' '}
            and setup all the settings with your{' '}
            <a className="text-link" href="https://github.com/ProjecVirgil/VirgilApp">
              mobile app
            </a>{' '}
            YOUR VIRGIL KEY: {config.key}
          </p>
          <div className="w-[100%] justify-center flex">
            <img src={gif} width={300} className="mt-1" alt="" />
          </div>
        </ScrollShadow>
      </div>
    </div>
  )
}

export default FinishScene
