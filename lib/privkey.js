'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var old = require('old');
var algorithms = require('./keyAlgorithms');
var PubKey = require('./pubkey.js');

var PrivKey = function () {
  function PrivKey(algoName, bytes) {
    _classCallCheck(this, PrivKey);

    this.algo = algorithms.get(algoName);

    // TODO: remove need to pass in pubkey, derive it instead
    var priv = bytes.slice(0, this.algo.privLength);
    if (this.algo.importPrivate) {
      this.key = this.algo.importPrivate(priv);
    } else {
      this.key = priv;
    }
    this.pub = new PubKey(algoName, bytes.slice(this.algo.privLength));
  }

  _createClass(PrivKey, [{
    key: 'address',
    value: function address() {
      return this.pub.address();
    }
  }, {
    key: 'pubkey',
    value: function pubkey() {
      return this.pub;
    }
  }, {
    key: 'bytes',
    value: function bytes() {
      var priv = this.key;
      if (this.algo.exportPrivate) {
        priv = this.algo.exportPrivate(this.key);
      }
      return Buffer.concat([priv, this.pub.bytes()]);
    }
  }, {
    key: 'sign',
    value: function sign(message) {
      return this.algo.sign(message, this.key);
    }
  }]);

  return PrivKey;
}();

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  var algo = algorithms.get(buffer[start]);
  var length = algo.privLength + algo.pubLength + 1;
  var key = buffer.slice(start + 1, start + length);
  decode.bytes = length;
  return new PrivKey(algo.name, key);
}

function encode(priv, buffer) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var length = encodingLength(priv);
  buffer = buffer || Buffer.alloc(length);
  buffer[offset] = priv.algo.id;
  priv.bytes().copy(buffer, offset + 1);
  encode.bytes = length;
  return buffer;
}

function encodingLength(priv) {
  return priv.algo.privLength + priv.algo.pubLength + 1;
}

function fromSeed(algoName, seed) {
  var algo = algorithms.get(algoName);
  var keypair = algo.generateFromSecret(seed);
  return fromKeyPair(algoName, keypair);
}

function generate(algoName) {
  var algo = algorithms.get(algoName);
  var keypair = algo.generate();
  return fromKeyPair(algoName, keypair);
}

function fromKeyPair(algoName, _ref) {
  var privateKey = _ref.privateKey,
      publicKey = _ref.publicKey;

  var bytes = Buffer.concat([privateKey, publicKey]);
  return new PrivKey(algoName, bytes);
}

Object.assign(PrivKey, {
  decode: decode,
  encode: encode,
  encodingLength: encodingLength,
  fromSeed: fromSeed,
  generate: generate
});

module.exports = old(PrivKey);