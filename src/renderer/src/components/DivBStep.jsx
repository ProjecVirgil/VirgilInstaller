import BStep from './BStep'

function DivBStep(props) {
  const { handleNext, handleBack,nextLabel,prevLabel } = props
  return (
    <div className="w-[100%] h-[36px] flex justify-end mt-[10px] ">
      <BStep handle={handleBack} label={prevLabel}></BStep>
      <BStep handle={handleNext} label={nextLabel} Isfirst={true}></BStep>
    </div>
  )
}

export default DivBStep
