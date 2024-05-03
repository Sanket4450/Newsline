const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { s3Client } = require('../config/aws')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const variables = require('../constants/variables')

exports.uploadFile = async (folderName, fileName, file) => {
  try {
    const params = {
      Bucket: variables.S3_BUCKET_NAME,
      Key: `${folderName}/${fileName}`,
      Body: file,
    }

    const abc = await s3Client.send(new PutObjectCommand(params))

    console.log(abc)

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
      Bucket: variables.S3_BUCKET_NAME,
      Key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: parseInt(variables.S3_URL_EXPIRY),
    })

    return signedUrl
  } catch (error) {
    throw new ApiError(
      messages.ERROR.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
