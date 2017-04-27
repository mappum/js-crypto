'use strict'

const test = require('tape')
const GO = !process.env.NO_GO_TESTS
const { goEval } = GO ? require('./util.js') : null

function goTest (...args) {
  if (!GO) return
  test(...args)
}

goTest('varint encode cross-check w/ go-crypto', function (t) {
  let output = goEval(`
    package main

    import "fmt"

    func main() {
      fmt.Println("1234")
    }
  `)
  t.equal(output, '123\n')
  t.end()
})
