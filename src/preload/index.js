import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

console.log('Preload script is running')
// Custom APIs for renderer
const api = {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
    ipcRenderer.removeListener(channel, func)
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
