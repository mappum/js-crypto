'use strict'

const algorithms = require('./keyAlgorithms')

function decode (buffer, start = 0, end = buffer.length) {
  let algo = algorithms.get(buffer[start])
  let length = algo.sigLength + 1
  let signature = buffer.slice(start + 1, start + length)
  decode.bytes = length
  signature.type = algo.id
  return signature
}

// TODO: include length prefix for secp256k1 since it is
// defined as a variable-length in go-crypto
function encode (sig, buffer, offset = 0) {
  let length = encodingLength(sig)
  buffer = buffer || Buffer.alloc(length)
  buffer[offset] = sig.type
  sig.copy(buffer, offset + 1)
  encode.bytes = length
  return buffer
}

function encodingLength (sig) {
  return sig.length + 1
}

module.exports = {
  decode,
  encode,
  encodingLength
}
