'use strict';

var _require = require('crypto'),
    randomBytes = _require.randomBytes;

var ed25519 = require('ed25519-supercop');

var _require2 = require('../hash.js'),
    sha256 = _require2.sha256;

function generate() {
  var seed = randomBytes(32);
  return generateFromSecret(seed);
}

function generateFromSecret(secret) {
  var keypair = ed25519.createKeyPair(sha256(secret));
  return {
    privateKey: keypair.secretKey,
    publicKey: keypair.publicKey
  };
}

module.exports = {
  name: 'ed25519',
  id: 1,
  privLength: 64,
  pubLength: 32,
  sigLength: 64,
  sign: ed25519.sign,
  verify: ed25519.verify,
  generate: generate,
  generateFromSecret: generateFromSecret
};