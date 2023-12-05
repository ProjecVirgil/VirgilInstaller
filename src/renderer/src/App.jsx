//import nomeclassecomponente from './components/nomefile'
import * as React from 'react'
import NavbarMain from './components/NavbarMain'
import Main from './components/Main'
import DivBStep from './components/DivBStep'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4']

const stepStyle = {
  '& .Mui-activate': {
    '&.MuiStepIcon-root': {
      color: 'rgba(165, 142, 245, 1)',
      fontSize: '20px'
    }
  },
  '& .Mui-completed': {
    '&.MuiStepIcon-root': {
      color: 'rgba(165, 142, 245, 1)',
      fontSize: '20px'
    }
  }
}
function App() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <div className="h-screen w-[100%]">
      <NavbarMain></NavbarMain>
      <Box sx={{ width: '80%', marginX: '50px', marginY: '6px' }}>
        <Stepper activeStep={activeStep} sx={stepStyle}>
          {steps.map((label, index) => (
            <Step key={label} >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Main></Main>
      <DivBStep handleBack={handleBack} handleNext={handleNext}></DivBStep>
    </div>
  )
}

export default App
//completed={completed[index]}
