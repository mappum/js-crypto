'use strict'

const algorithms = require('./keyAlgorithms')
const varint = require('./varint.js')

function isVariableLength(sig) {
  return Number(sig.type) === 2
}

function decode(buffer, start = 0, end = buffer.length) {
  let algo = algorithms.get(buffer[start])
  let signature
  if (algo.sigLength) {
    let length = algo.sigLength
    signature = buffer.slice(start + 1, start + length)
    decode.bytes = 1 + length
  } else {
    let length = varint.decode(buffer, start + 1, end)
    let sigStart = start + 1 + varint.decode.bytes
    signature = buffer.slice(sigStart, sigStart + length)
    decode.bytes = 1 + varint.decode.bytes + length
  }
  signature.type = algo.id
  return signature
}

function encode(sig, buffer, offset = 0) {
  let length = encodingLength(sig)
  buffer = buffer || Buffer.alloc(length)
  buffer[offset] = sig.type

  if (isVariableLength(sig)) {
    // add varint length prefix
    let lenPrefix = varint.encode(sig.length)
    lenPrefix.copy(buffer, offset + 1)
    sig.copy(buffer, offset + lenPrefix.length + 1)
  } else {
    sig.copy(buffer, offset + 1)
  }
  encode.bytes = length
  return buffer
}

function encodingLength(sig) {
  if (isVariableLength(sig)) {
    // sig length, type byte, varint length prefix bytes
    return sig.length + 1 + varint.encodingLength(sig.length)
  } else {
    // signature length plus the type byte
    return sig.length + 1
  }
}

module.exports = {
  decode,
  encode,
  encodingLength
}
