const transporter = require('../config/nodemailer')
const httpStatus = require('http-status')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const util = require('util')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')

const sendMail = async ({ email, subject, templateFile, data }) => {
  try {
    const readFileAsync = util.promisify(fs.readFile)

    const htmlContent = await readFileAsync(templateFile, 'utf-8')

    const renderedHtml = ejs.render(htmlContent, data)

    const mailOptions = {
      from: `${process.env.EMAIL_HOST} <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: renderedHtml,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new ApiError(
      messages.ERROR.ERROR_SENDING_MAIL,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.sendRegisterOTP = async ({ email, otp }) => {
  try {
    Logger.info(`Inside sendRegisterOTP => email = ${email}, otp = ${otp}`)

    const templateFile = path.join(__dirname, '../views/registerOtp.ejs')

    sendMail({
      email,
      subject: messages.SUBJECT.REGISTER_ACCOUNT,
      templateFile,
      data: { otp },
    })
  } catch (error) {
    Logger.error(`sendRegisterOTP error => ${error}`)

    throw new ApiError(
      messages.ERROR.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.sendResetOTP = async ({ name, email, otp }) => {
  try {
    Logger.info(
      `Inside sendResetOTP => name = ${name}, email = ${email}, otp = ${otp}`
    )

    const templateFile = path.join(__dirname, '../views/resetPasswordOtp.ejs')

    sendMail({
      email,
      subject: messages.SUBJECT.RESET_PASSWORD,
      templateFile,
      data: { name, otp },
    })
  } catch (error) {
    Logger.error(`sendResetOTP error => ${error}`)

    throw new ApiError(
      messages.ERROR.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
