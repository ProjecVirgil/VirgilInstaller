import { useEffect, useState } from 'react'
import NavbarMain from './components/NavbarMain'
import Main from './components/Main'
import DivBStep from './components/DivBStep'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import PropTypes from 'prop-types'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import Check from '@mui/icons-material/Check'
import { styled } from '@mui/material/styles'
import FinishScene from './components/FinishScene'
let isSelected = false
window.api.receive('checked', () => {
  isSelected = !isSelected
})

const steps = ['Welcome', 'License', 'Configuration', 'Installation']

const stepStyle = {
  '& .Mui-active': {
    '&.MuiStepLabel-label': {
      color: 'rgba(221, 221, 223, 1)',
      fontSize: '15px'
    }
  },
  '& .Mui-completed': {
    '&.MuiStepLabel-label': {
      color: 'rgba(221, 221, 223, 1)',
      fontSize: '15px'
    }
  },
  '& .Mui-disabled': {
    '&.MuiStepLabel-label': {
      color: 'rgba(221, 221, 223, 1)',
      fontSize: '15px'
    }
  }
}
function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [toDisable, setToDisable] = useState(true)
  const [skipped, setSkipped] = useState(new Set())

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (activeStep == 1) {
      if (!isSelected) {
        window.api.send('reminder_to_check')
      } else {
        isSelected = false
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values())
          newSkipped.delete(activeStep)
        }
        if (activeStep < steps.length) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
          setSkipped(newSkipped)
        }
      }
    } else {
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values())
        newSkipped.delete(activeStep)
      }
      if (activeStep < steps.length) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        setSkipped(newSkipped)
      }
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  useEffect(() => {
    const handleIndex = (finish) => {
      if (!finish && activeStep == steps.length - 1) {
        setToDisable(false)
      }
    }
    window.api.receiveOnce('checkDisable', handleIndex)
  }, [activeStep])

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#A58EF5'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#A58EF5'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1
    }
  }))

  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#A58EF5'
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#A58EF5',
      zIndex: 1,
      fontSize: 22
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor'
    }
  }))

  function QontoStepIcon(props) {
    const { active, completed, className } = props

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    )
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool
  }

  return (
    <div className="h-screen w-[100%]">
      <NavbarMain></NavbarMain>
      <Box sx={{ width: '80%', marginX: '50px', marginY: '6px' }}>
        <Stepper activeStep={activeStep} sx={stepStyle} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep !== steps.length ? <Main step={activeStep}></Main> : <FinishScene></FinishScene>}
      <DivBStep
        isDisable={activeStep === steps.length - 1 ? toDisable : false}
        nextLabel={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        prevLabel="Prev"
        handleBack={handleBack}
        handleNext={handleNext}
        isVisible={activeStep !== steps.length}
      ></DivBStep>
    </div>
  )
}

export default App
