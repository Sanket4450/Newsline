const multer = require('multer')
const fs = require('fs')
const os = require('os')
const httpStatus = require('http-status')
const osTempDir = fs.realpathSync(os.tmpdir())
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const variables = require('../constants/variables')

exports.uploadFile =
  (fieldName = 'file') =>
  async (req, res, next) => {
    try {
      const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, osTempDir)
        },
      })

      const maxFileSize = variables.maxFileSize

      const upload = multer({
        storage,
        limits: { fileSize: maxFileSize, files: 1 },
      }).single(fieldName)

      upload(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            switch (err.code) {
              case 'LIMIT_FILE_SIZE':
                next(
                  new ApiError(
                    `Upload file size is limited to ${(
                      maxFileSize /
                      1024 /
                      1024
                    ).toPrecision(2)} MB`,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_FILE_COUNT':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_FILE_COUNT,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_UNEXPECTED_FILE':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_UNEXPECTED_FILE,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_PART_COUNT':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_PART_COUNT,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_FIELD_KEY':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_FIELD_KEY,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_FIELD_VALUE':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_FIELD_VALUE,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              case 'LIMIT_FIELD_COUNT':
                next(
                  new ApiError(
                    messages.ERROR.LIMIT_FIELD_COUNT,
                    httpStatus.BAD_REQUEST
                  )
                )
                break
              default:
                next(
                  new ApiError(
                    `Upload failed: ${err.message}`,
                    httpStatus.BAD_REQUEST
                  )
                )
            }
          }
          next(err)
        }
        next()
      })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  }
