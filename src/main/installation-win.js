const ws = require('windows-shortcuts')
import extract from 'extract-zip'
import path from 'path'
import os from 'os'
import fs from 'fs'

import {
  downloadFile,
  readAndParseJSONFile,
  getVersionVirgil,
  execCommand,
  writeJSONToFile,
  createUser,
  modifyTomlFile
} from './utils.js'

//* ----- WINDOWS -------
export async function installVirgil(event, app) {
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

export async function installDependence(event) {
  try {
    const last_version = await getVersionVirgil()
    const data = await readAndParseJSONFile('config.json')

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
    stdout = await execCommand(
      `cd ${pathPythonEnv} && "C:\\Program Files\\Python311\\python.exe" -m venv virgil-env && .\\virgil-env\\Scripts\\activate.bat && cd setup && pip install -r ./requirements.txt`
    )

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

export async function createStartFile(event) {
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

export async function setConfig(event) {
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
