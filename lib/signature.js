'use strict';

var algorithms = require('./keyAlgorithms');
var NIL = Buffer.alloc(0);
NIL.type = 0;

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  var type = buffer[start];
  if (type === 0) return null;
  var algo = algorithms.get(type);
  var signature = algo.Signature.decode(buffer, start + 1, end);
  signature.type = algo.id;
  decode.bytes = algo.Signature.decode.bytes + 1;
  return signature;
}

function encode(sig, buffer) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (sig == null) sig = NIL;
  var algo = algorithms.get(sig.type);
  buffer = buffer || Buffer.allocUnsafe(encodingLength(sig));
  buffer[offset] = sig.type;
  var bytes = algo.Signature.encode(sig, buffer, offset + 1);
  encode.bytes = algo.Signature.encode.bytes + 1;
  return bytes;
}

function encodingLength(sig) {
  if (sig == null || sig === NIL) return 1;
  var algo = algorithms.get(sig.type);
  return algo.Signature.encodingLength(sig) + 1;
}

module.exports = {
  decode: decode,
  encode: encode,
  encodingLength: encodingLength
};