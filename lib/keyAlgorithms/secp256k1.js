'use strict';

var _require = require('crypto'),
    randomBytes = _require.randomBytes;

var secp256k1 = require('secp256k1');

var _require2 = require('../hash.js'),
    sha256 = _require2.sha256;

function sign(msg, priv) {
  return secp256k1.sign(sha256(msg), priv).signature;
}

function verify(sig, msg, pub) {
  return secp256k1.verify(sha256(msg), sig, pub);
}

function generate() {
  do {
    var privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));
  var publicKey = secp256k1.publicKeyCreate(privateKey);
  return { privateKey: privateKey, publicKey: publicKey };
}

function generateFromSecret(secret) {
  var privateKey = sha256(secret);
  var publicKey = secp256k1.publicKeyCreate(privateKey);
  return { privateKey: privateKey, publicKey: publicKey };
}

module.exports = {
  name: 'secp256k1',
  id: 2,
  privLength: 32,
  pubLength: 64,
  sigLength: 64,
  sign: sign,
  verify: verify,
  generate: generate,
  generateFromSecret: generateFromSecret,
  exportPrivate: secp256k1.privateKeyExport,
  importPrivate: secp256k1.privateKeyImport,
  exportPublic: secp256k1.publicKeyExport,
  importPublic: secp256k1.publicKeyImport,
  exportSignature: secp256k1.signatureExport,
  importSignature: secp256k1.signatureImport
};