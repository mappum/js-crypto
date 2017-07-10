'use strict'

const struct = require('varstruct')
const varint = require('../varint.js')
const VarBuffer = struct.VarBuffer(varint)

const algorithms = [
  {
    name: 'null',
    id: 0,
    sigLength: 0
  },
  require('./ed25519'),
  require('./secp256k1.js')
]

const byId = {}
const byName = {}
algorithms.forEach(algo => {
  algo.Signature = algo.sigLength == null ? VarBuffer : struct.Buffer(algo.sigLength)
  byId[algo.id] = algo
  byName[algo.name] = algo
})

algorithms.get = function(id) {
  let algo
  if (typeof id === 'string') {
    algo = byName[id]
  } else {
    algo = byId[id]
  }
  if (algo == null) {
    throw new Error(`Unknown key algorithm: ${id}`)
  }
  return algo
}

module.exports = algorithms
