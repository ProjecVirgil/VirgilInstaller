function Main(props) {
  const step = props.step
  const content = () => {
    if (step == 0) {
      return <h1>Benvenuto</h1>
    } else if (step == 1) {
      return <h1>Licenza</h1>
    } else if (step == 2) {
      return <h1>Installazione</h1>
    } else if (step == 3) {
      return <h1>Config locale e creazione chiave</h1>
    } else if (step == 4) {
      return <h1>Config locale e creazione chiave</h1>
    }
  }

  return <div className="main">{content()}</div>
}

export default Main
