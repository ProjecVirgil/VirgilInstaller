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

//* ----- LINUX -------
