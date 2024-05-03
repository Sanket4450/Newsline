const nodemailer = require('nodemailer')
const variables = require('../constants/variables')

const transporter = nodemailer.createTransport({
  service: variables.EMAIL_SERVICE,
  auth: {
    user: variables.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

module.exports = transporter
