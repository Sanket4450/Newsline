const nodemailer = require('nodemailer')
const variables = require('../constants/variables')

const transporter = nodemailer.createTransport({
  service: variables.emailService,
  auth: {
    user: variables.emailUser,
    pass: process.env.EMAIL_PASS,
  },
})

module.exports = transporter
