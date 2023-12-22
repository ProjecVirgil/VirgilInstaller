export function getJSON(file_path) {
  return new Promise((resolve) => {
    const handleJSON = (data) => {
      resolve(data)
    }

    window.api.receiveOnce('gettedJSON', handleJSON)
    window.api.send('getJSON', file_path)
  })
}

export function setJSON(file_path, new_data) {
  return new Promise((resolve) => {
    const handleJSON = (data) => {
      resolve(data)
    }

    window.api.receiveOnce('settedJSON', handleJSON)
    window.api.send('setJSON', [file_path, new_data])
  })
}
