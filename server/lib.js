// A circular buffer that overwrites old values as it gets new ones
class CircularBuffer {
  constructor({ maxSize }) {
    this.buffer = []
    this.maxSize = maxSize
    this.index = 0
  }

  // Abstract pushing so it behaves like an infinite stack
  push(value) {
    // Reached max size of the array, so set index back to 0
    if (this.index === this.maxSize) this.index = 0

    // Set the value at the next index
    this.buffer[this.index] = value
    this.index += 1
  }
}

// Get IP address of the server making request
function getIpAddress(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress
}

// Explanation of regex used for checking if a string is an integer
// [\+]*? and [\-]*? check if the user put any minus or plus signs
  // An integer can contain any number of +'s or -'s at the start, but not both
// \d+ checks if after +'s and -'s, only digits 0-9 follow it 
const INT_REGEX = /^[\+]*?[\-]*?\d+$/ // eslint-disable-line

// Check if a string is an integer using a regex
function isInteger(str) {
  return INT_REGEX.test(str)
}

module.exports = {
  CircularBuffer,
  getIpAddress,
  isInteger
}