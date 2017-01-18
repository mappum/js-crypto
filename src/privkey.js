'use strict'

const old = require('old')
const algorithms = require('./keyAlgorithms')
const { ripemd160 } = require('./hash.js')

class PrivKey {
  constructor (algoName, bytes) {
    this.algo = algorithms.get(algoName)

    if (this.algo.importPrivate) {
      this.key = this.algo.importPrivate(bytes)
    } else {
      this.key = bytes
    }
  }

  address () {
    return ripemd160(encode(this))
  }

  bytes () {
    if (this.algo.exportPrivate) {
      return this.algo.exportPrivate(this.key)
    }
    return this.key
  }

  sign (message) {
    return this.algo.sign(message, this.key)
  }
}

function decode (buffer, start = 0, end = buffer.length) {
  let algo = algorithms.get(buffer[start])
  let key = buffer.slice(start + 1, end)
  decode.bytes = algo.privLength + 1
  return new PrivKey(algo.name, key)
}

function encode (priv, buffer, offset = 0) {
  let length = encodingLength(priv)
  buffer = buffer || Buffer.alloc(length)
  priv.bytes().copy(buffer, offset)
  encode.bytes = length
  return buffer
}

function encodingLength (priv) {
  return priv.algo.privateLength + 1
}

function fromSeed (algoName, seed) {
  let algo = algorithms.get(algoName)
  let key = algo.generateFromSecret(seed)
  return new PrivKey(algoName, key)
}

function generate (algoName) {
  let algo = algorithms.get(algoName)
  let key = algo.generate()
  return new PrivKey(algoName, key)
}

Object.assign(PrivKey, {
  decode,
  encode,
  encodingLength,
  fromSeed,
  generate
})

module.exports = old(PrivKey)
