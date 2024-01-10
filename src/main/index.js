import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from 'path'
import icon from '../../resources/icons/icon.png'
import fs from 'fs'
import axios from 'axios'
import os from 'os'
import cheerio from 'cheerio'

import { installVirgil, installDependence, createStartFile, setConfig } from './installation'
import { readAndParseJSONFile, writeJSONToFile } from './utils.js'

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    roundedCorners: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      additionalArguments: ['--enable-features=SharedArrayBuffer'],
      webviewTag: false,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle('Virgil Installer v2.1.0')
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  init_config()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('close', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})

ipcMain.on('reminder_to_check', () => {
  mainWindow.webContents.send('reminder')
})

ipcMain.on('check', () => {
  mainWindow.webContents.send('checked')
})

ipcMain.on('toDisable', (event, finish) => {
  mainWindow.webContents.send('checkDisable', finish)
})

ipcMain.on('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'] // Usa 'openFile' per file
  })
  if (!result.canceled && result.filePaths.length > 0) {
    event.sender.send('selected-directory', result.filePaths[0])
  }
})

// *  ---- UTILS LISTENER -----
ipcMain.on('downloadImage', (event) => {
  const imageUrls = [
    'https://img.shields.io/badge/2%2C1k-2%2C1k?style=for-the-badge&logo=visualstudiocode&label=Lines%20of%20code&labelColor=282a3&color=%23164773',
    'https://img.shields.io/github/commit-activity/w/Retr0100/VirgilAI?style=for-the-badge&logo=github&labelColor=%23282a3&color=%231B7F79',
    'https://img.shields.io/github/repo-size/Retr0100/VirgilAI?style=for-the-badge&logo=github&labelColor=%23282a3&color=%23bd93f9',
    'https://img.shields.io/badge/9,6-9,6?style=for-the-badge&logo=scrutinizerci&label=Scrutinizer&labelColor=282a3&color=%23008000'
  ]

  for (const [index, url] of imageUrls.entries()) {
    axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        const imageDataBuffer = Buffer.from(response.data, 'binary')
        fs.writeFileSync(
          path.join('src', 'renderer', 'src', 'assets', 'img') + '/img' + index + '.svg',
          imageDataBuffer
        )
        event.reply('imageDownloaded', 'Image downloaded and saved successfully!')
      })
      .catch((error) => {
        event.reply('imageDownloadError', `Error downloading and saving image: ${error.message}`)
      })
  }
})

ipcMain.on('search_update', (event) => {
  axios.get('https://github.com/ProjecVirgil/VirgilInstaller/tags').then((response) => {
    const $ = cheerio.load(response.data)
    const content = $('body').html()
    const regex = /v\d+\.\d+\.\d+/
    const results = content.match(regex)
    const last_version = results[0]
    const packageJsonPath = path.join('package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const actual_version = packageJson.version
    const to_update = check_if_update(actual_version, last_version)
    event.sender.send('result_check', to_update)
  })
})

// * ------ SOME UTILS INTERNAL FUNCTION --------
function check_if_update(actual, last_version) {
  if (actual === last_version) {
    return false
  }

  const parse_version_actual = actual
    .replace('', '')
    .split('.')
    .map((str) => parseInt(str, 10))
  const parse_last_version = last_version
    .replace('v', '')
    .split('.')
    .map((str) => parseInt(str, 10))

  if (parse_version_actual[0] < parse_last_version[0]) {
    return true
  } else {
    if (parse_version_actual[1] < parse_last_version[1]) {
      return true
    } else {
      if (parse_version_actual[2] < parse_last_version[2]) {
        return true
      } else {
        return false
      }
    }
  }
}

// * ------- SETUP --------

ipcMain.on('runcommand', (event, command) => {
  setTimeout(() => {
    if (command === 'InsVir') {
      installVirgil(event, app) //WORK
      // event.sender.send('outputcommand', 'success')
    } else if (command === 'InsPy') {
      installDependence(event) //WORK
      // event.sender.send('outputcommand', 'success')
    } else if (command === 'CreateStartFile') {
      createStartFile(event) //WORK
      // event.sender.send('outputcommand', 'success')
    } else if (command === 'SetConf') {
      setConfig(event) // WORK
      // event.sender.send('outputcommand', 'success')
    }
  }, 500)
})

// * ----- JSON MANAGER -------

ipcMain.on('getJSON', (event, path) => {
  readAndParseJSONFile(path)
    .then((jsonData) => {
      event.reply('gettedJSON', jsonData)
    })
    .catch((error) => {
      console.error(error)
    })
})

ipcMain.on('setJSON', (event, data) => {
  writeJSONToFile(data[0], data[1])
    .then(() => {
      event.reply('settedJSON', { status: 'success' })
    })
    .catch((error) => {
      console.error(error)
    })
})

//------- CONFIG INIT -------

async function init_config() {
  fs.access('config.json', fs.constants.F_OK, async (err) => {
    if (err) {
      const data = {
        first_start: true,
        startup: false,
        specify_interface: false,
        type_interface: 'N',
        installation_path: path.join(
          'C:',
          'Users',
          os.userInfo().username,
          'AppData',
          'Local',
          'Programs'
        ),
        icon_on_desktop: true,
        display_console: true,
        key: ''
      }
      const jsonData = JSON.stringify(data, null, 2)
      fs.writeFile('config.json', jsonData, 'utf8', function (err) {
        if (err) {
          console.log('Error during the write of file json:', err)
        }
      })
    }
  })
}
