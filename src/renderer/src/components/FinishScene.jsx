import { ScrollShadow, Snippet } from '@nextui-org/react'
import gif from '../assets/img/giphy.gif'
import { useEffect, useState } from 'react'
import { getJSON } from '../utils/JsonManager'

function FinishScene() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    getJSON('config.json')
      .then((data) => {
        console.log('Data loaded:', data)
        setConfig(data)
      })
      .catch((error) => {
        console.error('Error during the load of config', error)
      })
  }, [])

  return (
    <div>
      <div className="main">
        <ScrollShadow
          offset={100}
          size={20}
          className="w-[100%] h-[99%] rounded-[24px] p-5 change_font scroll-smooth"
        >
          <div className="text-center">
            <h1 className="text-[24px] font-bold mb-4">INSTALLATION COMPLETE</h1>
            <p className="text-[16px] leading-relaxed mb-4">
              Ok, now you can follow the guide on this{' '}
              <a
                target="_blank"
                className="text-link underline text-[#a58ef5] hover:text-[#b59ff6]"
                href="https://github.com/ProjecVirgil/VirgilAI?tab=readme-ov-file#guide-to-online-settings"
                rel="noreferrer"
              >
                link
              </a>{' '}
              and set up all the settings with your{' '}
              <a
                className="text-link underline text-[#a58ef5] hover:text-[#b59ff6]"
                target="_blank"
                href="https://github.com/ProjecVirgil/VirgilApp"
                rel="noreferrer"
              >
                mobile app
              </a>.
              <br />
              <br />
              <span className="text-[18px] font-bold mb-4">YOUR VIRGIL KEY:</span>{' '}
              {config ? (
                <Snippet color="primary" size="sm" className="text-[12px]">
                  {config.key}
                </Snippet>
              ) : (
                <span>Loading key...</span>
              )}
            </p>
            <div className="flex justify-center">
              <img src={gif} width={300} className="mt-1" alt="Installation process animation" />
            </div>
          </div>
        </ScrollShadow>
      </div>
    </div>
  )
}

export default FinishScene
