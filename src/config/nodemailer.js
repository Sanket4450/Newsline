const nodemailer = require('nodemailer')
const fs = require('fs')
const util = require('util')

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

module.exports = transporter
