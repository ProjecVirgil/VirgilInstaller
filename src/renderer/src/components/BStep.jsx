import { Button } from '@nextui-org/react'
function BStep(props) {
  const { label, Isfirst, handle } = props

  const classes = Isfirst ? 'button mr-[30px]' : 'button mr-[20px]'
  return (
    <div className="div-button">
      <Button className={classes} color="primary" onClick={handle}>
        {label}
      </Button>
    </div>
  )
}

export default BStep
