const { AWS } = require('../config/aws')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')

const s3 = new AWS.S3()

exports.uploadFile = async (folderName, fileName, file) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: file,
  }

  return new Promise((resolve, reject) => [
    s3.upload(params, (err, data) => {
      if (err) {
        reject(
          new ApiError(
            messages.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
          )
        )
      }
      resolve(data.Location)
    }),
  ])
}
