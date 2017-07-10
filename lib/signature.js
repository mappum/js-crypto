'use strict';

var algorithms = require('./keyAlgorithms');
var varint = require('./varint.js');

function isVariableLength(sig) {
  return Number(sig.type) === 2;
}

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  var algo = algorithms.get(buffer[start]);
  var signature = void 0;
  if (algo.sigLength) {
    var length = algo.sigLength;
    signature = buffer.slice(start + 1, start + length);
    decode.bytes = 1 + length;
  } else {
    var _length = varint.decode(buffer, start + 1, end);
    var sigStart = start + 1 + varint.decode.bytes;
    signature = buffer.slice(sigStart, sigStart + _length);
    decode.bytes = 1 + varint.decode.bytes + _length;
  }
  signature.type = algo.id;
  return signature;
}

function encode(sig, buffer) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var length = encodingLength(sig);
  buffer = buffer || Buffer.alloc(length);
  buffer[offset] = sig.type;

  if (isVariableLength(sig)) {
    // add varint length prefix
    var lenPrefix = varint.encode(sig.length);
    lenPrefix.copy(buffer, offset + 1);
    sig.copy(buffer, offset + lenPrefix.length + 1);
  } else {
    sig.copy(buffer, offset + 1);
  }
  encode.bytes = length;
  return buffer;
}

function encodingLength(sig) {
  if (isVariableLength(sig)) {
    // sig length, type byte, varint length prefix bytes
    return sig.length + 1 + varint.encodingLength(sig.length);
  } else {
    // signature length plus the type byte
    return sig.length + 1;
  }
}

module.exports = {
  decode: decode,
  encode: encode,
  encodingLength: encodingLength
};