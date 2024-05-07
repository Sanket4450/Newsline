const path = require('path')
const fs = require('fs')
const Jimp = require('jimp')
const httpStatus = require('http-status')
const messages = require('../constants/messages')
const folders = require('../constants/folders')
const ApiError = require('../utils/ApiError')
const storageService = require('./storage')
const variables = require('../constants/variables')

const validateFileType = (fileName) => {
  const extname = path.extname(fileName).slice(1)

  const supportedFiles = variables.SUPPORTED_FILE_TYPES?.split(' ')

  if (!supportedFiles.includes(extname?.toLowerCase())) {
    throw new ApiError(
      messages.ERROR.FILE_TYPE_NOT_SUPPORTED,
      httpStatus.BAD_REQUEST
    )
  }
}

const resizeImage = async (filePath, width) => {
  try {
    const image = await Jimp.read(filePath)
    const mime = image.getMIME()

    return image.resize(width || Jimp.AUTO, Jimp.AUTO).getBufferAsync(mime)
  } catch (error) {
    throw new ApiError(
      messages.ERROR.FILE_OPERATION,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.handleFile = async (file, folderName) => {
  if (!file) {
    throw new ApiError(messages.ERROR.FILE_NOT_PROVIDED, httpStatus.BAD_REQUEST)
  }

  const fileName = file.originalname
  validateFileType(fileName)

  let fileBuffer

  switch (folderName) {
    case folders.USER:
      fileBuffer = await resizeImage(file.path, 300)
      break

    case folders.LANGUAGE:
      fileBuffer = await resizeImage(file.path, 150)
      break

    case folders.TOPIC:
      fileBuffer = await resizeImage(file.path, 100)
      break

    case folders.STORY:
      fileBuffer = await resizeImage(file.path, 800)
      break

    default:
      fileBuffer = fs.readFileSync(file.path)
  }

  const fileKey = await storageService.uploadFile(
    folderName,
    fileName,
    fileBuffer
  )

  return fileKey
}
