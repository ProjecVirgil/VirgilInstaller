import BStep from './BStep'

function DivBStep(props) {
  const { handleNext, handleBack } = props
  return (
    <div className="w-[100%] h-[36px] flex justify-end mt-[10px] ">
      <BStep handle={handleBack} label="Prev"></BStep>
      <BStep handle={handleNext} label="Next" Isfirst={true}></BStep>
    </div>
  )
}

export default DivBStep
