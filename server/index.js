const express = require('express')

// Settings for the express app
const app = express()
const PORT = process.env.PORT || 3001

// Helper functions
const { isInteger, getIpAddress, CircularBuffer } = require('./lib.js')

// Config values
const BUFFER_SIZE = 1000

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

// Endpoint with no parameter
app.get('/isodd', (req, res) => {
  return res.json({ error: 'Did not specify an integer in query.'})
})

// Cache the last 1000 requests in this object
const pastRequests = {}
app.get('/isodd/:number', (req, res) => {
  const ip = getIpAddress(req)
  const { number } = req.params

  // Check if a number was provided
  if (number == null) {
    return res.json({ error: 'Did not specify any integer in query.' })
  }

  // Only integers can have a parity (odd/even)
  if (!isInteger(number)) {
    return res.json({ error: 'Did not a specify a valid integer.' })
  }

  // Check the parity of the number
  const lastDigit = parseInt(number[number.length - 1])
  const isOdd = lastDigit % 2 === 1

  // If this is first request from IP, initialize array
  if (pastRequests[ip] == null) {
    pastRequests[ip] = new CircularBuffer({ maxSize: BUFFER_SIZE })
  }

  // Push the result (odd/even) to the cache
  pastRequests[ip].push(isOdd)

  // Send the parity as JSON
  return res.json({ isOdd })
})

// TO-DO: Add machine learning to this
// Endpoint that uses machine learning to predict if next value will be even or odd
app.get('/predict', (req, res) => {
  const ip = getIpAddress(req)
  
  // Error if we have no data on them
  if (pastRequests[ip] == null) {
    return res.json({ error: 'You must call the isOdd endpoint with a valid integer at least once to get a prediction.'})
  }

  const probability = (pastRequests[ip].buffer.reduce((val, sum) => val + sum)/pastRequests[ip].buffer.length).toFixed(3)
  const willItBeOdd = probability >= 0.5
  return res.json({ willItBeOdd, probability })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
