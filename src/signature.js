'use strict'

const algorithms = require('./keyAlgorithms')
const NIL = Buffer.alloc(0)
NIL.type = 0

function decode(buffer, start = 0, end = buffer.length) {
  let type = buffer[start]
  if (type === 0) return null
  let algo = algorithms.get(type)
  let signature = algo.Signature.decode(buffer, start + 1, end)
  signature.type = algo.id
  decode.bytes = algo.Signature.decode.bytes + 1
  return signature
}

function encode(sig, buffer, offset = 0) {
  if (sig == null) sig = NIL
  let algo = algorithms.get(sig.type)
  buffer = buffer || Buffer.allocUnsafe(encodingLength(sig))
  buffer[offset] = sig.type
  let bytes = algo.Signature.encode(sig, buffer, offset + 1)
  encode.bytes = algo.Signature.encode.bytes + 1
  return bytes
}

function encodingLength(sig) {
  if (sig == null || sig === NIL) return 1
  let algo = algorithms.get(sig.type)
  return algo.Signature.encodingLength(sig) + 1
}

module.exports = {
  decode,
  encode,
  encodingLength
}
