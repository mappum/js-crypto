'use strict'

const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const { ripemd160, sha256 } = require('../hash.js')

function sign (msg, priv) {
  return secp256k1.sign(sha256(msg), priv).signature
}

function verify (sig, msg, pub) {
  return secp256k1.verify(sha256(msg), sig, pub)
}

function generate () {
  do {
    var privateKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privateKey))
  let publicKey = secp256k1.publicKeyCreate(privateKey)
  return { privateKey, publicKey }
}

function generateFromSecret (secret) {
  let privateKey = sha256(secret)
  let publicKey = secp256k1.publicKeyCreate(privateKey)
  return { privateKey, publicKey }
}

function address (pubkeyBytes) {
  return ripemd160(sha256(pubkeyBytes))
}

module.exports = {
  name: 'secp256k1',
  id: 2,
  privLength: 32,
  pubLength: 64,
  sigLength: 64,
  sign,
  verify,
  generate,
  generateFromSecret,
  derivePublic: secp256k1.publicKeyCreate,
  address
}
