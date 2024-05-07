const variables = {
  REGISTER_TOKEN_EXPIRY: '15m',
  RESET_TOKEN_EXPIRY: '15m',
  SESSION_CLEANUP_DURATION: 5184000000, // 60 days
  EMAIL_SERVICE: 'gmail',
  EMAIL_HOST: 'Newsline',
  EMAIL_USER: 'virenradadiya3@gmail.com',
  SUPPORTED_FILE_TYPES: 'jpg jpeg png gif bmp tiff webp svg ico psd eps raw',
  MAX_FILE_SIZE: 6291456, // 6 MB
  AWS_REGION: 'us-east-1',
  S3_BUCKET_NAME: 'newsline-images',
  S3_URL_EXPIRY: 7200,
}

module.exports = variables
