import ConfigScene from './ConfigScene'
import { ScrollShadow } from '@nextui-org/react'
import NavbarMain from './NavbarMain'
import BStep from './BStep'

function ModifyInstallationScene() {
  return (
    <div>
      <NavbarMain></NavbarMain>
      <div className="main">
        <ScrollShadow
          offset={100}
          size={20}
          className="w-[100%] h-[99%] rounded-[24px] p-5 change_font scroll-smooth "
        >
          <ConfigScene label="Modify configuration"></ConfigScene>
        </ScrollShadow>
      </div>
      <div className="w-[100%] h-[70px] flex justify-end mt-[10px]">
        <BStep
          handle={() => {
            window.api.receiveOnce('outputcommand', () => {
              window.api.send('close')
            })
            window.api.send('runcommand', 'SetConf')
          }}
          label="Save"
        ></BStep>
      </div>
    </div>
  )
}
export default ModifyInstallationScene
