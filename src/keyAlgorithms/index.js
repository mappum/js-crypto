'use strict'

const ALGORITHMS = [
  require('./ed25519'),
  require('./secp256k1.js')
]

const byId = {}
const byName = {}
ALGORITHMS.forEach((algo) => {
  byId[algo.id] = algo
  byName[algo.name] = algo
})

module.exports = {
  ALGORITHMS,
  byId,
  byName
}
