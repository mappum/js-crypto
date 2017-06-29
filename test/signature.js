'use strict'

const test = require('tape')
const signature = require('../lib/signature.js')
const PubKey = require('../lib/pubkey.js')
const PrivKey = require('../lib/privkey.js')
const GO = !process.env.NO_GO_TESTS
const { goBuild } = GO ? require('./util.js') : null

// skips test if NO_GO_TESTS envvar is set
function goTest(...args) {
  if (!GO) return
  test(...args)
}

function goSign(algo, message) {
  let out = goBuild(
    `
  package main

  import (
    "bytes"
    "encoding/hex"
    "fmt"

    crypto "github.com/tendermint/go-crypto"
  )

  func main () {
    // generate keypair 
    priv := crypto.GenPrivKey${algo === 'ed25519' ? 'Ed25519' : 'Secp256k1'}()
    pub := priv.PubKey()

    msgBytes, err := hex.DecodeString("${Buffer.from(message).toString('hex')}")
    if err != nil {
      panic(err)
    }
    sig := priv.Sign(msgBytes)

    var buf bytes.Buffer
    
    buf.WriteString(hex.EncodeToString(pub.Bytes()))
    buf.WriteString(",") 
    buf.WriteString(hex.EncodeToString(sig.Bytes()))

    fmt.Println(buf.String())
  }
  `
  )()
  return out.toString()
}

function goVerify(algo, pubKey, sig, message) {
  let pub = pubKey.toString('hex')
  let typeByte = algo === 'ed25519' ? '01' : '02'
  let out = goBuild(
    `
    package main

    import (
      "encoding/hex"
      "fmt"

      crypto "github.com/tendermint/go-crypto"
    )
    
    func main() {
      bytes, err := hex.DecodeString("${pub}")
      if err != nil {
        panic(err)
      }
      
      pub, err := crypto.PubKeyFromBytes(bytes)
      if err != nil {
        panic(err)
      }

      msg, err := hex.DecodeString("${Buffer.from(message).toString('hex')}")
      if err != nil {
        panic(err)
      }

      sigBytes, err := hex.DecodeString("${sig.toString('hex')}")
      if err != nil {
        panic(err)
      }
      
      sig, err := crypto.SignatureFromBytes(sigBytes)
      if err != nil {
        panic(err)
      }
      isValid := pub.VerifyBytes(msg, sig)
      fmt.Println(isValid)
    }
  `
  )()
  let output = out.toString()
  return output.indexOf('true') !== -1
}

test('ed25519 signing/verifying', t => {
  t.plan(2)
  const payload = 'test123'
  const algo = 'ed25519'
  let priv = PrivKey.generate(algo)
  let pub = priv.pubkey()
  let sig = priv.sign(Buffer.from(payload))

  t.equals(pub.verify(sig, payload), true)
  t.equals(pub.verify(sig, 'incorrect message'), false)
})

test('secp256k1 signing/verifying', t => {
  t.plan(2)
  const payload = 'test123'
  const algo = 'secp256k1'
  let priv = PrivKey.generate(algo)
  let pub = priv.pubkey()
  let sig = priv.sign(Buffer.from(payload))

  t.equals(pub.verify(sig, payload), true)
  t.equals(pub.verify(sig, 'incorrect message'), false)
})

test('verify js-crypto ed25519 signature in go-crypto', t => {
  t.plan(2)
  const payload = 'woohoo'
  const algo = 'ed25519'
  let priv = PrivKey.generate(algo)
  let pub = priv.pubkey()
  let sig = priv.sign(Buffer.from(payload))

  t.ok(goVerify(algo, PubKey.encode(pub), signature.encode(sig), payload))
  t.notOk(
    goVerify(
      algo,
      PubKey.encode(pub),
      signature.encode(sig),
      'not the correct payload'
    )
  )
})

test('verify js-crypto secp256k1 signature in go-crypto', t => {
  t.plan(2)
  const payload = 'woohoo'
  const algo = 'secp256k1'
  let priv = PrivKey.generate(algo)
  let pub = priv.pubkey()
  let sig = priv.sign(Buffer.from(payload))

  t.ok(goVerify(algo, PubKey.encode(pub), signature.encode(sig), payload))
  t.notOk(
    goVerify(
      algo,
      PubKey.encode(pub),
      signature.encode(sig),
      'not the correct payload'
    )
  )
})

test('verify go-crypto ed25519 signature in js-crypto', t => {
  t.plan(2)
  const payload = 'test123'
  const algo = 'ed25519'
  let [pubBytes, sigBytes] = goSign(algo, payload)
    .split(',')
    .map(h => Buffer.from(h, 'hex'))

  let pub = PubKey.decode(pubBytes)
  let sig = signature.decode(sigBytes)

  t.ok(pub.verify(sig, payload))
  t.notOk(pub.verify(sig, 'not the correct payload'))
})

test('verify go-crypto secp256k1 signature in js-crypto', t => {
  t.plan(2)
  const payload = 'test123'
  const algo = 'secp256k1'
  let [pubBytes, sigBytes] = goSign(algo, payload)
    .split(',')
    .map(h => Buffer.from(h, 'hex'))

  let pub = PubKey.decode(pubBytes)
  let sig = signature.decode(sigBytes)

  t.ok(pub.verify(sig, payload))
  t.notOk(pub.verify(sig, 'not the correct payload'))
})
