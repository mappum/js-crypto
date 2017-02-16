'use strict';

var createHash = require('create-hash');

var hash = function hash(algo) {
  return function (data) {
    return createHash(algo).update(data).digest();
  };
};

exports.ripemd160 = hash('ripemd160');
exports.sha256 = hash('sha256');