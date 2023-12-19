import { useState } from 'react'
import { Checkbox } from '@nextui-org/react'
import Tip from './Tips'

function SelectOption(props) {
  const { Title, headerTip, contentTip } = props
  const [isSelectedG1, setIsSelectedG1] = useState(true)
  const [isSelectedG2, setIsSelectedG2] = useState(false)
  return (
    <div className="div_check">
      <div className="flex">
        <h1 className="subtitle mb-2 w-[90px] mr-2">{Title}</h1>
        <div className="w-5">
          <Tip header={headerTip} content={contentTip}></Tip>
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
  )
}

export default SelectOption
