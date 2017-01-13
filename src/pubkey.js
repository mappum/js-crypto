'use strict'

const assign = require('object-assign')
const old = require('old')
const getKeyAlgorithms = require('./keyAlgorithms.js')

let ALGORITHMS = getKeyAlgorithms('PubKey')

function reqd (name) {
  throw new Error(`Argument "${name}" is required`)
}

class PubKey {
  constructor (algo = reqd('algo'), bytes = reqd('bytes')) {
    let Key = this.algorithm = ALGORITHMS.get(algo)
    this.key = Key(bytes)
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
