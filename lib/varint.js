'use strict';

var MAX_VALUE = Math.pow(2, 53) - 1;

function decode(buffer) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : buffer.length;

  var size = buffer[start];
  var value = 0;
  for (var i = start + 1; i <= start + size; i++) {
    value <<= 8;
    value |= buffer[i];
  }
  decode.bytes = size + 1;
  return value;
}

function encode(n) {
  var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Buffer.alloc(encodingLength(n));
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var size = encodingLength(n) - 1;
  buffer[offset] = size;
  for (var i = offset + size; i > offset; i--) {
    buffer[i] = n & 0xff;
    n >>= 8;
  }
  encode.bytes = size + 1;
  return buffer;
}

function encodingLength(n) {
  if (n < 0 || n > MAX_VALUE) {
    throw new Error('varint value is out of bounds');
  }
  var size = 1;
  while (n > 0) {
    n >>= 8;
    size += 1;
  }
  return size;
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength };