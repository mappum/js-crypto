'use strict'

const assign = require('object-assign')
const old = require('old')
const getKeyAlgorithms = require('./keyAlgorithms.js')

let ALGORITHMS = getKeyAlgorithms('PubKey')
let SIG_ALGORITHMS = getKeyAlgorithms('PubKey')

function reqd (name) {
  throw new Error(`Argument "${name}" is required`)
}

class PubKey {
  constructor (algo = reqd('algo'), bytes = reqd('bytes')) {
    let Key = this.algorithm = ALGORITHMS.get(algo)
    this.key = Key(bytes)
  }

  verify (msg = reqd('message'), sig = reqd('signature')) {
    let Signature = SIG_ALGORITHMS.get(this.algorithm.id)
    return this.key.VerifyBytes(msg, Signature(sig))
  }

  address () {
    return this.key.Address()
  }

  bytes () {
    return this.key.Bytes()
  }

  equals (other) {
    return other instanceof PubKey && this.key.Equals(other.key)
  }

  toString () {
    return this.key.String()
  }
}

module.exports = assign(old(PubKey), { ALGORITHMS })
