const path = require('path')
const fs = require('fs')
const httpStatus = require('http-status')
const messages = require('../constants/messages')
const ApiError = require('../utils/ApiError')
const storageService = require('./storage')
const variables = require('../constants/variables')

const validateFileType = (fileName) => {
  const extname = path.extname(fileName).slice(1)

  const supportedFiles = variables.SUPPORTED_FILE_TYPES?.split(' ')

  if (!supportedFiles.includes(extname?.toLowerCase())) {
    throw new ApiError(messages.ERROR.FILE_TYPE_NOT_SUPPORTED, httpStatus.BAD_REQUEST)
  }
}

exports.handleFile = async (file, folderName) => {
  if (!file) {
    throw new ApiError(messages.ERROR.FILE_NOT_PROVIDED, httpStatus.BAD_REQUEST)
  }

  const fileName = file.originalname
  validateFileType(fileName)

  const fileBuffer = fs.readFileSync(file.path)

  const fileKey = await storageService.uploadFile(folderName, fileName, fileBuffer)

  return fileKey
}
