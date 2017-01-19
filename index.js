module.exports = Object.assign({
  PrivKey: require('./lib/privkey.js'),
  PubKey: require('./lib/pubkey.js'),
  keyAlgorithms: require('./lib/keyAlgorithms')
}, require('./lib/hash.js'))
