require('dotenv').config({ path: '.env.dev' })

const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 8888

const app = express()

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

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`)
})
