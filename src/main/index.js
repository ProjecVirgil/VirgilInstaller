import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from 'path'
import icon from '../../resources/icons/icon.png'
import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
const { exec } = require('child_process')

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

ipcMain.on('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'] // Usa 'openFile' per file
  })
  if (!result.canceled && result.filePaths.length > 0) {
    event.sender.send('selected-directory', result.filePaths[0])
  }
})

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

function check_if_update(actual, last_version) {
  if (actual === last_version) {
    return false
  }

  const parse_version_actual = actual
    .replace('v', '')
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

ipcMain.on('runcommand', (event, command) => {
  // Execute 'dir' command
  setTimeout(() => {
    exec(command, (error, stdout) => {
      if (error) {
        console.error('exec error: ' + error)
        event.sender.send('outputcommand', 'Error during the execution of command: ' + error.message)
        return
      }
      event.sender.send('outputcommand', formatOutput(stdout))
    })
}, 2000);
})

function formatOutput(output) {
  // Format the output as needed
  // Here we replace new lines with <br> for HTML display
  const formattedOutput = output.replace(/\n/g, ' <br> ')
  return formattedOutput
}
