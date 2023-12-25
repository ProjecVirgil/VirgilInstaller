import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from 'path'
import icon from '../../resources/icons/icon.png'
import fs from 'fs'
import axios from 'axios'
import os from 'os'
import cheerio from 'cheerio'
import extract from 'extract-zip'
const { exec } = require('child_process')
const ws = require('windows-shortcuts')

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

function getVersionVirgil() {
  return axios.get('https://github.com/ProjecVirgil/VirgilAI/tags').then((response) => {
    const $ = cheerio.load(response.data)
    const content = $('body').html()
    const regex = /v\d+\.\d+\.\d+/
    const results = content.match(regex)
    if (results && results.length > 0) {
      return results[0]
    } else {
      throw new Error('Version not found')
    }
  })
}

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath)

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  }).then((response) => {
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  })
}
//        if (os.type().includes('Windows_NT')) {

function installVirgil(event) {
  const username = os.userInfo().username

  getVersionVirgil().then((last_version) => {
    let path_installation
    let download_url
    const filename = `${last_version}.zip`
    path_installation = path.join(app.getPath('downloads'), filename)
    download_url = `https://github.com/ProjecVirgil/VirgilAI/archive/refs/tags/${last_version}.zip`

    downloadFile(download_url, path_installation)
      .then(() => {
        const outputDir = path.join('C:', 'Users', username, 'AppData', 'Local', 'Programs')
        extract(path_installation, { dir: outputDir }, function (err) {
          if (err) {
            event.sender.send('outputcommand', 'error ' + err)
          }
        })
      })
      .catch((error) => {
        event.sender.send('outputcommand', 'error ' + error)
      })
    event.sender.send('outputcommand', 'COMPLETE')
  })
}

function installDependence(event) {
  const username = os.userInfo().username
  getVersionVirgil().then((last_version) => {
    const path_python = path.join(
      'C:',
      'Users',
      username,
      'AppData',
      'Local',
      'Programs',
      `VirgilAI-${last_version.replace('v', '')}`,
      'depences'
    )
    const execCommand = `cd ${path_python} && python-3.11.7-amd64.exe /quiet InstallAllUsers=1 PrependPath=1`
    exec(execCommand, (error, stdout) => {
      if (error) {
        event.sender.send('outputcommand', 'error ' + error)
        console.error(error)
        return
      }
      console.log(stdout)
      const path_python1 = path.join(
        'C:',
        'Users',
        username,
        'AppData',
        'Local',
        'Programs',
        `VirgilAI-${last_version.replace('v', '')}`
      )
      const execCommand1 = `cd ${path_python1} && python -m venv virgil-env && .\\virgil-env\\Scripts\\activate.bat && cd setup && pip install -r ./requirements.txt`
      exec(execCommand1, (error, stdout) => {
        if (error) {
          event.sender.send('outputcommand', 'error ' + error)
          console.error(error)
          return
        }
        console.log(stdout)
        const execCommand2 = `cd ${path_python1} && .\\virgil-env\\Scripts\\activate.bat && poetry install`
        exec(execCommand2, (error, stdout) => {
          if (error) {
            event.sender.send('outputcommand', 'error ' + error)
            console.error(error)
            return
          }
          console.log(stdout)
          event.sender.send('outputcommand', formatOutput(stdout))
        })
      })
    })
  })
}

function createStartFile(event) {
  //creo il file bat/bash nella stessa cartella di virgilio
  //creo il collegamento poi con icon e tutto

  getVersionVirgil().then((last_version) => {
    const username = os.userInfo().username
    const path_directory = path.join(
      'C:',
      'Users',
      username,
      'AppData',
      'Local',
      'Programs',
      `VirgilAI-${last_version.replace('v', '')}`
    )

    let batContent = `
  @echo off
  cd ${path_directory}
  call virgil-env\\Scripts\\activate.bat
  poetry run python launch.py
  `

    // The path of the .bat file
    const filePath = path.join(path_directory, 'start.bat') // Usa __dirname per la directory corrente

    // Write the content to the .bat file
    fs.writeFile(filePath, batContent, (err) => {
      if (err) {
        console.error('Error writing to .bat file:', err)
      } else {
        console.log('.bat file created successfully')
      }
    })

    // Creazione del collegamento (aggiusta questo secondo la libreria che stai usando)
    ws.create(
      `C:\\Users\\${username}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\VirgilAI.lnk`,
      { target: filePath, desc: 'VirgilAI start file', icon: 'resources\\icons\\icon.png' }
    )

    event.sender.send('outputcommand', 'success')
  })
}

function setConfig(event) {
  //modifico i valori della config locale dentro al file
  //pyproject (assicurati che io prenda la config ancora cosi dentro virgil)
  event.sender.send('outputcommand', 'ok')
}

ipcMain.on('runcommand', (event, command) => {
  setTimeout(() => {
    if (command === 'InsVir') {
      installVirgil(event) //WORK
      // event.sender.send('outputcommand', 'cioa')
    } else if (command === 'InsPy') {
      installDependence(event) //WORK
      // event.sender.send('outputcommand', 'cioa')
    } else if (command === 'CreateStartFile') {
      createStartFile(event) //WORK
      // event.sender.send('outputcommand', 'cioa')
    } else if (command === 'SetConf') {
      setConfig(event)
      // event.sender.send('outputcommand', 'cioa')
    }
  }, 3000)
})

function formatOutput(output) {
  // Format the output as needed
  // Here we replace new lines with <br> for HTML display
  const formattedOutput = output.replace(/\n/g, ' <br> ')
  return formattedOutput
}

ipcMain.on('getJSON', (event, path) => {
  readAndParseJSONFile(path)
    .then((jsonData) => {
      event.reply('gettedJSON', jsonData)
    })
    .catch((error) => {
      console.error(error)
      //event.reply('gettedJSON', { error: '' })
    })
})

function readAndParseJSONFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      try {
        const jsonData = JSON.parse(data)
        resolve(jsonData)
      } catch (parseError) {
        reject(parseError)
      }
    })
  })
}

function writeJSONToFile(filePath, jsonData) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(jsonData, null, 2)
    fs.writeFile(filePath, dataString, 'utf8', (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

ipcMain.on('setJSON', (event, data) => {
  writeJSONToFile(data[0], data[1])
    .then(() => {
      event.reply('settedJSON', { status: 'success' })
    })
    .catch((error) => {
      console.error(error)
      //event.reply('settedJSON', { error: '' })
    })
})

function init_config() {
  const data = {
    first_start: true,
    startup: false,
    specify_interface: false,
    type_interface: 'N',
    installation_path: 'C:\\Programs', //DA PROVARE POI CON LINUX E ALTRE COSE VARie
    icon_on_desktop: true,
    config_key: ''
  }
  const jsonData = JSON.stringify(data, null, 2)

  fs.access('config.json', fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile('config.json', jsonData, 'utf8', function (err) {
        if (err) {
          console.log('Si è verificato un errore durante la scrittura del file JSON:', err)
        } else {
          console.log('File JSON salvato con successo.')
        }
      })
    } else {
      console.log('Il file esiste.')
    }
  })
}
