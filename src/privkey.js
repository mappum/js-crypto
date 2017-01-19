'use strict'

const old = require('old')
const algorithms = require('./keyAlgorithms')
const PubKey = require('./pubkey.js')

class PrivKey {
  constructor (algoName, bytes) {
    this.algo = algorithms.get(algoName)

    // TODO: remove need to pass in pubkey, derive it instead
    let priv = bytes.slice(0, this.algo.privLength)
    if (this.algo.importPrivate) {
      this.key = this.algo.importPrivate(priv)
    } else {
      this.key = priv
    }
    this.pub = new PubKey(algoName, bytes.slice(this.algo.privLength))
  }

  address () {
    return this.pub.address()
  }

  pubkey () {
    return this.pub
  }

  bytes () {
    let priv = this.key
    if (this.algo.exportPrivate) {
      priv = this.algo.exportPrivate(this.key)
    }
    return Buffer.concat([ priv, this.pub.bytes() ])
  }

  sign (message) {
    return this.algo.sign(message, this.key)
  }
}

function decode (buffer, start = 0, end = buffer.length) {
  let algo = algorithms.get(buffer[start])
  let length = algo.privLength + algo.pubLength + 1
  let key = buffer.slice(start + 1, start + length)
  decode.bytes = length
  return new PrivKey(algo.name, key)
}

function encode (priv, buffer, offset = 0) {
  let length = encodingLength(priv)
  buffer = buffer || Buffer.alloc(length)
  buffer[offset] = priv.algo.id
  priv.bytes().copy(buffer, offset + 1)
  encode.bytes = length
  return buffer
}

function encodingLength (priv) {
  return priv.algo.privLength + priv.algo.pubLength + 1
}

function fromSeed (algoName, seed) {
  let algo = algorithms.get(algoName)
  let keypair = algo.generateFromSecret(seed)
  return fromKeyPair(algoName, keypair)
}

function generate (algoName) {
  let algo = algorithms.get(algoName)
  let keypair = algo.generate()
  return fromKeyPair(algoName, keypair)
}

function fromKeyPair (algoName, { privateKey, publicKey }) {
  let bytes = Buffer.concat([ privateKey, publicKey ])
  return new PrivKey(algoName, bytes)
}

Object.assign(PrivKey, {
  decode,
  encode,
  encodingLength,
  fromSeed,
  generate
})

module.exports = old(PrivKey)
