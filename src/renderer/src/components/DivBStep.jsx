import BStep from './BStep'

function DivBStep(props) {
  const { handleNext, handleBack, nextLabel, prevLabel, isVisible } = props

  return (
    <div className="w-[100%] h-[36px] flex justify-end mt-[10px]">
      <BStep handle={handleBack} label={prevLabel} />
      {isVisible ? (
        <BStep handle={handleNext} label={nextLabel} Isfirst={true} />
      ) : (
        <BStep handle={() => window.api.send('close')} label="Close" Isfirst={true} />
      )}
    </div>
  )
}

export default DivBStep
