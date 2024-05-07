require('dotenv').config()

const express = require('express')
const cors = require('cors')
const httpStatus = require('http-status')
const Logger = require('./utils/logger')
const connectDB = require('./config/db')
const { userRouter, adminRouter } = require('./routes')
const ApiError = require('./utils/ApiError')
const messages = require('./constants/messages')
const { errorConverter, errorHandler } = require('./middlewares/error')
require('./services/cronjob')

const port = process.env.PORT || 8888

const app = express()

global.Logger = Logger

connectDB()

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Authorization, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  next()
})

app.use(
  cors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Authorization',
      'Content-Type',
      'Accept',
    ],
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(express.static(pathToSwaggerUi))

// app.use('/api/docs', swaggerRoutes)

app.get('/', (_, res) => {
  res.send('App is running...')
})

app.use('/api', userRouter)
app.use('/api/admin', adminRouter)

app.use((_, __, next) => {
  next(new ApiError(messages.ERROR.ROUTE_NOT_FOUND, httpStatus.NOT_FOUND))
})

app.use(errorConverter)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`)
})
