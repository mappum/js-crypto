let crypto = require('../build/go-crypto.js')

exports.armor = {
  encode ({ type, headers, data }) {
    return crypto.EncodeArmor(type, headers, data)
  },
  decode (armor) {
    let [ type, headers, data, err ] = crypto.DecodeArmor(armor)
    if (err) throw new Error(err)
    return { type, headers, data }
  }
}

exports.sha256 = crypto.Sha256
exports.ripemd160 = crypto.Ripemd160

exports.PrivKey = require('./privKey.js')
// exports.
