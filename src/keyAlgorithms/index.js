'use strict'

const algorithms = [
  require('./ed25519'),
  require('./secp256k1.js')
]

const byId = {}
const byName = {}
algorithms.forEach((algo) => {
  byId[algo.id] = algo
  byName[algo.name] = algo
})

algorithms.get = function (id) {
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
