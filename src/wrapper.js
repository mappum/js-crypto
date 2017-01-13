let crypto = require('../build/go-crypto.js')

exports.armor = {
  encode ({ type, headers, data }) {
    return crypto.EncodeArmor(type, headers, data)
  },
  decode (armor) {
    let [ type, headers, data, err ] = crypto.DecodeArmor(armor)
    if (err != null) throw new Error(err)
    return { type, headers, data }
  }
}

exports.sha256 = crypto.Sha256
exports.ripemd160 = crypto.Ripemd160

exports.PrivKey = require('./privkey.js')
exports.PubKey = require('./pubkey.js')

exports.symmetric = {
  encrypt (plaintext, secret) {
    return crypto.EncryptSymmetric(plaintext, secret)
  },
  decrypt (ciphertext, secret) {
    let [ plaintext, err ] = crypto.DecryptSymmetric(ciphertext, secret)
    if (err != null) throw new Error(err)
    return plaintext
  }
}
