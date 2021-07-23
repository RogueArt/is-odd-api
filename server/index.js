const express = require('express')

// Settings for the express app
const app = express()
const PORT = process.env.PORT || 3001

// Helper functions
const { isInteger, getIpAddress, CircularBuffer } = require('./lib.js')

// Config values
const BUFFER_SIZE = 1000
// const MAX_VAL = 1000

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
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

  // Convert the number into an integer
  // if (parseInt(number) > 999) {
  //   return res.json({ error: 'Exceed range of allowed values.' })
  // }

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})
