'use strict'

const test = require('tape')
const varint = require('../lib/varint.js')
const GO = !process.env.NO_GO_TESTS
const { goEval } = GO ? require('./util.js') : null

// skips test if NO_GO_TESTS envvar is set
function goTest (...args) {
  if (!GO) return
  test(...args)
}

function goEncodeVarint (n) {
  return goEval(`
    package main

    import (
      "os"
      "github.com/tendermint/go-wire"
    )

    func main() {
      var n int
      var err error
      wire.WriteUvarint(${n}, os.Stdout, &n, &err)
    }
  `)
}

goTest('varint encoding cross-checked with go-crypto', function (t) {
  let values = [ 0, 1, 255, 256, 1000, 1234567890 ]
  for (let n of values) {
    let goBytes = goEncodeVarint(n).toString('hex')
    let jsBytes = varint.encode(n).toString('hex')
    t.equal(jsBytes, goBytes, `correct varint encoding for n=${n}`)
  }
  t.end()
})

test('encode/decode varints', function (t) {
  let values = [ 0, 1, 255, 256, 1000, 1234567890 ]
  for (let n of values) {
    let encoded = varint.encode(n)
    let decoded = varint.decode(encoded)
    let length = varint.encodingLength(n)
    t.equal(decoded, n, `decoded correct number for n=${n}`)
    t.equal(length, encoded.length, `correct encodingLength for n=${n}`)
  }
  t.end()
})

test('value out of bounds', function (t) {
  let values = [ -1, Math.pow(2, 53) ]
  for (let n of values) {
    try {
      varint.encode(n)
      t.fail('should have thrown')
    } catch (err) {
      t.ok(err, 'error thrown')
      t.equal(err.message, 'varint value is out of bounds', 'correct error message')
    }
  }
  t.end()
})
