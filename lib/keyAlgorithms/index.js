'use strict';

var algorithms = [require('./ed25519'), require('./secp256k1.js')];

var byId = {};
var byName = {};
algorithms.forEach(function (algo) {
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