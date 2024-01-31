import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from 'path'
import icon from '../../resources/icons/icon.png'
import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
import extract from 'extract-zip'
import os from 'os'

const toml = require('@iarna/toml')
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

function modifyTomlFile(filePath, modifications) {
  fs.readFile(filePath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error('Error during writing:', readErr)
      return
    }
    try {
      let config = toml.parse(data)
      if (!config.tool) {
        config.tool = {}
      }
      if (!config.tool.config_system) {
        config.tool.config_system = {}
      }
      Object.keys(modifications).forEach((key) => {
        config.tool.config_system[key] = modifications[key]
      })
      const modifiedToml = toml.stringify(config)
      fs.writeFile(filePath, modifiedToml, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error during the write phase:', writeErr)
          return
        }
      })
    } catch (err) {
      console.error('Error during the analysis or the writing of file', err)
    }
  })
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { shell: true }, (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

// * ------- SETUP --------

async function installVirgil(event) {
  try {
    const lastVersion = await getVersionVirgil()
    const filename = `${lastVersion}.zip`
    const pathInstallation = path.join(app.getPath('downloads'), filename)
    const downloadUrl = `https://github.com/ProjecVirgil/VirgilAI/archive/refs/tags/${lastVersion}.zip`

    await downloadFile(downloadUrl, pathInstallation)

    const data = await readAndParseJSONFile('config.json')
    await extract(pathInstallation, { dir: data.installation_path })

    event.sender.send('outputcommand', 'COMPLETE')
  } catch (error) {
    event.sender.send('outputcommand', 'error ' + error.message)
  }
}

async function installDependence(event) {
  try {
    const last_version = await getVersionVirgil()
    const data = await readAndParseJSONFile('config.json')
    const username = os.userInfo().username
    const baseDir = path.join(data.installation_path, `VirgilAI-${last_version.replace('v', '')}`)

    // Install Python
    const pathPython = path.join(baseDir, 'setup')
    let stdout
    try {
      stdout = await execCommand('python -V')
      if (!(stdout.trim() == 'Python 3.11.7')) {
        await execCommand(
          `cd ${pathPython} && python-3.11.7-amd64.exe /quiet InstallAllUsers=1 PrependPath=1`
        )
      }
    } catch (error) {
      if (error.message.includes('Python was not found')) {
        // Python not installed, proceed with installation
        await execCommand(
          `cd ${pathPython} && python-3.11.7-amd64.exe /quiet InstallAllUsers=1 PrependPath=1`
        )
      } else {
        throw error
      }
    }
    // Setup Python environment
    const pathPythonEnv = path.join(baseDir)
    try {
      stdout = await execCommand(
        `cd ${pathPythonEnv} && "C:\\Program Files\\Python311\\python.exe" -m venv virgil-env && .\\virgil-env\\Scripts\\activate.bat && cd setup && pip install -r ./requirements.txt`
      )
    } catch {
      stdout = await execCommand(
        `cd ${pathPythonEnv} && "C:\\Users\\${username}\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe" -m venv virgil-env && .\\virgil-env\\Scripts\\activate.bat && cd setup && pip install -r ./requirements.txt`
      )
    }

    // Install Poetry dependencies
    stdout = await execCommand(
      `cd ${pathPythonEnv} && .\\virgil-env\\Scripts\\activate.bat && poetry install --no-dev`
    )

    stdout = await execCommand(
      'winget install ffmpeg -h --accept-package-agreements --accept-source-agreements'
    )

    event.sender.send('outputcommand', stdout)
  } catch (error) {
    event.sender.send('outputcommand', 'error ' + error)
    console.error(error)
  }
}

async function createStartFile(event) {
  try {
    const username = os.userInfo().username
    const last_version = await getVersionVirgil()
    const data = await readAndParseJSONFile('config.json')

    const path_directory = path.join(
      data.installation_path,
      `VirgilAI-${last_version.replace('v', '')}`
    )

    let batContent = `
    @echo off
    cd ${path_directory}
    call virgil-env\\Scripts\\activate.bat
    poetry run python launch.py
    pause
    `

    const filePath = path.join(path_directory, 'start.bat')

    await fs.promises.writeFile(filePath, batContent)

    ws.create(
      path.join(
        'C:',
        'Users',
        username,
        'AppData',
        'Roaming',
        'Microsoft',
        'Windows',
        'Start Menu',
        'Programs',
        'VirgilAI.lnk'
      ),
      {
        target: filePath,
        desc: 'VirgilAI start file',
        icon: path.join(
          data.installation_path,
          `VirgilAI-${last_version.replace('v', '')}`,
          'assets',
          'img',
          'icon.ico'
        )
      }
    )
    event.sender.send('outputcommand', 'success')
  } catch (err) {
    console.error('Error writing to .bat file:', err)
    event.sender.send('outputcommand', 'error ' + err.message)
  }
}

async function setConfig(event) {
  try {
    const username = os.userInfo().username
    const last_version = await getVersionVirgil()
    let data = await readAndParseJSONFile('config.json')

    const validateKey = (value) => value.match(/^[a-f0-9]{32}$/i)
    //PHASE 0
    if (!validateKey(data.key)) {
      const key = await createUser()
      data.key = key
      await writeJSONToFile('config.json', data)
    }

    //PHASE 1
    if (data.startup) {
      const sourcePath = path.join(
        'C:',
        'Users',
        username,
        'AppData',
        'Roaming',
        'Microsoft',
        'Windows',
        'Start Menu',
        'Programs',
        'VirgilAI.lnk'
      )
      const destinationPath = path.join(
        'C:',
        'Users',
        username,
        'AppData',
        'Roaming',
        'Microsoft',
        'Windows',
        'Start Menu',
        'Programs',
        'Startup',
        'VirgilAI.lnk'
      )
      fs.copyFileSync(sourcePath, destinationPath)
    } else {
      const filePath = path.join(
        'C:',
        'Users',
        username,
        'AppData',
        'Roaming',
        'Microsoft',
        'Windows',
        'Start Menu',
        'Programs',
        'Startup',
        'VirgilAI.lnk'
      )
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
        } catch (err) {
          console.error('Error during the remotion of file:', err)
        }
      } else {
        console.log('The file dont exist')
      }
    }
    //PHASE 2
    modifyTomlFile(
      path.join(
        data.installation_path,
        `VirgilAI-${last_version.replace('v', '')}`,
        'pyproject.toml'
      ),
      { default_start: data.type_interface }
    )
    //PHASE 3
    if (!data.display_console) {
      const path_directory = path.join(
        data.installation_path,
        `VirgilAI-${last_version.replace('v', '')}`
      )
      let batContent = `
      @echo off
      cd ${path_directory}
      call virgil-env\\Scripts\\activate.bat
      poetry run "C:\\Program Files\\python311\\python.exe" launch.pyw
      `
      const filePath = path.join(path_directory, 'start.bat')

      await fs.promises.writeFile(filePath, batContent, (err) => {
        if (err) {
          console.error('Error writing to .bat file:', err)
        }
      })

      await fs.promises.rename(
        path.join(path_directory, 'launch.py'),
        path.join(path_directory, 'launch.pyw'),
        (err) => {
          if (err) {
            console.error('Error during the renaming of file:', err)
          }
        }
      )
    } else {
      const path_directory = path.join(
        data.installation_path,
        `VirgilAI-${last_version.replace('v', '')}`
      )
      let batContent = `
      @echo off
      cd ${path_directory}
      call virgil-env\\Scripts\\activate.bat
      poetry run python launch.py
      pause
      `
      const filePath = path.join(path_directory, 'start.bat')

      await fs.promises.writeFile(filePath, batContent, (err) => {
        if (err) {
          console.error('Error writing to .bat file:', err)
        }
      })
      if (fs.existsSync(path.join(path_directory, 'launch.pyw'))) {
        await fs.promises.rename(
          path.join(path_directory, 'launch.pyw'),
          path.join(path_directory, 'launch.py'),
          (err) => {
            if (err) {
              console.error('Error during the renaming of file:', err)
            }
          }
        )
      }
    }

    if (data.icon_on_desktop) {
      const path_directory = path.join(
        data.installation_path,
        `VirgilAI-${last_version.replace('v', '')}`
      )
      const filePath = path.join(path_directory, 'start.bat')

      ws.create(`C:\\Users\\${username}\\Desktop\\VirgilAI.lnk`, {
        target: filePath,
        desc: 'VirgilAI start file',
        icon: path.join(
          data.installation_path,
          `VirgilAI-${last_version.replace('v', '')}`,
          'assets',
          'img',
          'icon.ico'
        )
      })
    } else {
      fs.access('C:\\Users\\${username}\\Desktop\\VirgilAI.lnk', fs.constants.F_OK, (err) => {
        const path_directory = path.join(
          data.installation_path,
          `VirgilAI-${last_version.replace('v', '')}`
        )
        const filePath = path.join(path_directory, 'start.bat')
        if (err) {
          console.log('The file dont exist')
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error during the remotion of  file:', err)
            }
          })
        }
      })
    }

    event.sender.send('outputcommand', 'success')
  } catch (error) {
    console.error(error)
    event.sender.send('outputcommand', 'error ' + error.message)
  }
}

ipcMain.on('runcommand', (event, command) => {
  setTimeout(() => {
    if (process.platform == 'win32') {
      if (command === 'InsVir') {
        installVirgil(event) //WORK
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
    })
})

//------- CONFIG INIT -------

async function createUser() {
  const url_base = 'https://virgilapi-production.up.railway.app' + '/api'
  const url = `${url_base}/createUser`
  try {
    const response = await axios.put(url, null, { timeout: 5000 })
    const userCreated = response.data
    return userCreated.userId
  } catch (error) {
    if (error instanceof axios.RequestError) {
      console.error("I can't establish a connection, check the network")
    } else {
      console.error('User not created')
    }
    return 'User not created'
  }
}

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
