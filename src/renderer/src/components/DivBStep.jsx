import BStep from './BStep'

function DivBStep(props) {
  const { handleNext, handleBack, nextLabel, prevLabel, isVisible, isDisable } = props

  return (
    <div className="w-[100%] h-[36px] flex justify-end mt-[10px]">
      {isVisible ? (
        <>
          <BStep handle={handleBack} disable={isDisable} label={prevLabel} />
          <BStep handle={handleNext} disabled={isDisable} label={nextLabel} Isfirst={true} />
        </>
      ) : (
        <BStep handle={() => window.api.send('close')} label="Close" Isfirst={true} />
      )}
    </div>
  )
}

export default DivBStep
