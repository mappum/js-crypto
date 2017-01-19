'use strict'

const old = require('old')
const struct = require('varstruct')
const algorithms = require('./keyAlgorithms')
const { ripemd160 } = require('./hash.js')
const varint = require('./varint.js')

const AddressBytes = struct([
  { name: 'type', type: struct.Byte },
  { name: 'key', type: struct.VarBuffer(varint) }
])

class PubKey {
  constructor (algoName, bytes) {
    this.algo = algorithms.get(algoName)

    if (this.algo.importPublic) {
      this.key = this.algo.importPublic(bytes)
    } else {
      this.key = bytes
    }
  }

  address () {
    let bytes = AddressBytes.encode({
      type: this.algo.id,
      key: this.bytes()
    })
    return ripemd160(bytes)
  }

  bytes () {
    if (this.algo.exportPublic) {
      return this.algo.exportPublic(this.key)
    }
    return this.key
  }

  verify (signature, message) {
    return this.algo.verify(signature, message, this.key)
  }
}

function decode (buffer, start = 0, end = buffer.length) {
  let algo = algorithms.get(buffer[start])
  let length = algo.pubLength + 1
  let key = buffer.slice(start + 1, start + length)
  decode.bytes = length
  return new PubKey(algo.name, key)
}

function encode (pub, buffer, offset = 0) {
  let length = encodingLength(pub)
  buffer = buffer || Buffer.alloc(length)
  buffer[offset] = pub.algo.id
  pub.bytes().copy(buffer, offset + 1)
  encode.bytes = length
  return buffer
}

function encodingLength (priv) {
  return priv.algo.pubLength + 1
}

Object.assign(PubKey, {
  decode,
  encode,
  encodingLength
})

module.exports = old(PubKey)
