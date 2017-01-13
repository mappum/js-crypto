'use strict'

const assign = require('object-assign')
const old = require('old')
const { randomBytes } = require('crypto')
const getKeyAlgorithms = require('./keyAlgorithms.js')
const PubKey = require('./pubkey.js')

let ALGORITHMS = getKeyAlgorithms('PrivKey')

function reqd (name) {
  throw new Error(`Argument "${name}" is required`)
}

class PrivKey {
  constructor (algo = reqd('algo'), bytes = reqd('bytes')) {
    let Key = this.algorithm = ALGORITHMS.get(algo)
    this.key = Key(bytes)
  }

  bytes () {
    return this.key.Bytes()
  }

  sign (msg = reqd('message')) {
    return this.key.Sign(msg)
  }

  pubKey () {
    let pubkey = this.key.PubKey()
    return PubKey(pubkey)
  }

  equals (other) {
    return other instanceof PrivKey && this.key.Equals(other.key)
  }

  toString () {
    return this.key.String()
  }
}

function generate (algo = reqd('algo')) {
  let algorithm = ALGORITHMS.get(algo)
  return new PrivKey(algo, randomBytes(algorithm.keyLength))
}

function generateFromSecret (algo = reqd('algo'), secret = reqd('secret')) {
  let algorithm = ALGORITHMS.get(algo)
  return new PrivKey(algo, algorithm.GenFromSecret(secret))
}

module.exports = assign(old(PrivKey), {
  ALGORITHMS,
  generate,
  generateFromSecret
})
