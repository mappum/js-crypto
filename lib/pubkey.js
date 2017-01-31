'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var old = require('old');
var struct = require('varstruct');
var algorithms = require('./keyAlgorithms');

var _require = require('./hash.js'),
    ripemd160 = _require.ripemd160;

var varint = require('./varint.js');

var AddressBytes = struct([{ name: 'type', type: struct.Byte }, { name: 'key', type: struct.VarBuffer(varint) }]);

var PubKey = function () {
  function PubKey(algoName, bytes) {
    _classCallCheck(this, PubKey);

    this.algo = algorithms.get(algoName);

    if (this.algo.importPublic) {
      this.key = this.algo.importPublic(bytes);
    } else {
      this.key = bytes;
    }
  }

  _createClass(PubKey, [{
    key: 'address',
    value: function address() {
      var bytes = AddressBytes.encode({
        type: this.algo.id,
        key: this.bytes()
      });
      return ripemd160(bytes);
    }
  }, {
    key: 'bytes',
    value: function bytes() {
      if (this.algo.exportPublic) {
        return this.algo.exportPublic(this.key);
      }
      return this.key;
    }
  }, {
    key: 'verify',
    value: function verify(signature, message) {
      return this.algo.verify(signature, message, this.key);
    }
  }]);

  return PubKey;
}();

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  if (buffer[start] === 0) {
    decode.bytes = 1;
    return null;
  }
  var algo = algorithms.get(buffer[start]);
  var length = algo.pubLength + 1;
  var key = buffer.slice(start + 1, start + length);
  decode.bytes = length;
  return new PubKey(algo.name, key);
}

function encode(pub, buffer) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var length = encodingLength(pub);
  buffer = buffer || Buffer.alloc(length);
  if (pub == null) {
    buffer[offset] = 0;
  } else {
    buffer[offset] = pub.algo.id;
    pub.bytes().copy(buffer, offset + 1);
  }
  encode.bytes = length;
  return buffer;
}

function encodingLength(pub) {
  if (pub == null) return 1;
  return pub.algo.pubLength + 1;
}

Object.assign(PubKey, {
  decode: decode,
  encode: encode,
  encodingLength: encodingLength
});

module.exports = old(PubKey);