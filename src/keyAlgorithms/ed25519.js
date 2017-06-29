'use strict'

const { randomBytes } = require('crypto')
const ed25519 = require('ed25519-supercop')
const { sha256 } = require('../hash.js')

function generate() {
  let seed = randomBytes(32)
  return generateFromSecret(seed)
}

function generateFromSecret(secret) {
  let keypair = ed25519.createKeyPair(sha256(secret))
  return {
    privateKey: keypair.secretKey,
    publicKey: keypair.publicKey
  }
}

module.exports = {
  name: 'ed25519',
  id: 1,
  privLength: 64,
  pubLength: 32,
  sigLength: 64,
  sign: ed25519.sign,
  verify: ed25519.verify,
  generate,
  generateFromSecret
}
