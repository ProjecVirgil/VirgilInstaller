import { Button } from '@nextui-org/react'
function BStep(props) {
  const { label, IsFirst, handle, disabled } = props

  const margin = IsFirst ? 'mr-[30px]' : 'button mr-[20px]'
  const classes = disabled ? `button_disabled ${margin}` : `button ${margin}`

  return (
    <div className="div-button">
      <Button disabled={disabled} className={classes} color="primary" onClick={handle}>
        {label}
      </Button>
    </div>
  )
}

export default BStep
