'use strict'

const createHash = require('create-hash')

const hash = algo => data => createHash(algo).update(data).digest()

exports.ripemd160 = hash('ripemd160')
exports.sha256 = hash('sha256')
