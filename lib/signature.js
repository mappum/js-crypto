'use strict';

var algorithms = require('./keyAlgorithms');

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  var algo = algorithms.get(buffer[start]);
  var length = algo.sigLength + 1;
  var signature = buffer.slice(start + 1, start + length);
  decode.bytes = length;
  return signature;
}

// TODO: include length prefix for secp256k1 since it is
// defined as a variable-length in go-crypto
function encode(sig, buffer) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var length = encodingLength(sig);
  buffer = buffer || Buffer.alloc(length);
  buffer[offset] = sig.type;
  sig.copy(buffer, offset + 1);
  encode.bytes = length;
  return buffer;
}

function encodingLength(sig) {
  return sig.length + 1;
}

module.exports = {
  decode: decode,
  encode: encode,
  encodingLength: encodingLength
};