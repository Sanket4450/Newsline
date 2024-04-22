const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { s3Client } = require('../config/aws')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')

exports.uploadFile = async (folderName, fileName, file) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}/${fileName}`,
      Body: file,
    }

    await s3Client.send(new PutObjectCommand(params))

    return params.Key
  } catch (error) {
    throw new ApiError(
      messages.ERROR.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getFileUrl = async (Key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: parseInt(process.env.S3_URL_EXPIRY),
    })

    return signedUrl
  } catch (error) {
    throw new ApiError(
      messages.ERROR.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
