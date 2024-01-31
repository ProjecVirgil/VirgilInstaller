import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'

const toml = require('@iarna/toml')
const { exec } = require('child_process')

//! MODULE FOR UTILS FUNCTION LIKE READ,WRITE IN JSON, READ FILE TOML AND EXECUTE COMMAND
export function execCommand(command) {
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
export function getVersionVirgil() {
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

export async function downloadFile(fileUrl, outputLocationPath) {
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

export function modifyTomlFile(filePath, modifications) {
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

export function readAndParseJSONFile(filePath) {
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

export function writeJSONToFile(filePath, jsonData) {
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

export async function createUser() {
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
