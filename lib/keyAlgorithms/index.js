'use strict';

var struct = require('varstruct');
var varint = require('../varint.js');
var VarBuffer = struct.VarBuffer(varint);

var algorithms = [{
  name: 'null',
  id: 0,
  sigLength: 0
}, require('./ed25519'), require('./secp256k1.js')];

var byId = {};
var byName = {};
algorithms.forEach(function (algo) {
  algo.Signature = algo.sigLength == null ? VarBuffer : struct.Buffer(algo.sigLength);
  byId[algo.id] = algo;
  byName[algo.name] = algo;
});

algorithms.get = function (id) {
  var algo = void 0;
  if (typeof id === 'string') {
    algo = byName[id];
  } else {
    algo = byId[id];
  }
  if (algo == null) {
    throw new Error('Unknown key algorithm: ' + id);
  }
  return algo;
};

module.exports = algorithms;