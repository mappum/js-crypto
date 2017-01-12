package main

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/tendermint/go-crypto"
)

func main() {
	exports := js.Module.Get("exports")

	// armor
	exports.Set("EncodeArmor", crypto.EncodeArmor)
	exports.Set("DecodeArmor", crypto.DecodeArmor)

	// hash
	exports.Set("Sha256", crypto.Sha256)
	exports.Set("Ripemd160", crypto.Ripemd160)

	// privkey
	exports.Set("PrivKeyTypeEd25519", crypto.PrivKeyTypeEd25519)
	exports.Set("PrivKeyTypeSecp256k1", crypto.PrivKeyTypeSecp256k1)
	exports.Set("PrivKeyFromBytes", crypto.PrivKeyFromBytes)
	exports.Set("PrivKeyEd25519", func(bytes [64]byte) *js.Object {
		var privkey crypto.PrivKeyEd25519 = bytes
		return js.MakeWrapper(privkey)
	})
	exports.Set("GenPrivKeyEd25519", crypto.GenPrivKeyEd25519)
	exports.Set("GenPrivKeyEd25519FromSecret", crypto.GenPrivKeyEd25519FromSecret)
	exports.Set("PrivKeySecp256k1", func(bytes [32]byte) *js.Object {
		var privkey crypto.PrivKeySecp256k1 = bytes
		return js.MakeWrapper(privkey)
	})
	exports.Set("GenPrivKeySecp256k1", crypto.GenPrivKeySecp256k1)
	exports.Set("GenPrivKeySecp256k1FromSecret", crypto.GenPrivKeySecp256k1FromSecret)

	// pubkey
	exports.Set("PubKeyTypeEd25519", crypto.PubKeyTypeEd25519)
	exports.Set("PubKeyTypeSecp256k1", crypto.PubKeyTypeSecp256k1)
	exports.Set("PubKeyFromBytes", crypto.PubKeyFromBytes)
	exports.Set("PubKeyEd25519", func(bytes [32]byte) *js.Object {
		var privkey crypto.PubKeyEd25519 = bytes
		return js.MakeWrapper(privkey)
	})
	exports.Set("PubKeySecp256k1", func(bytes [64]byte) *js.Object {
		var privkey crypto.PubKeySecp256k1 = bytes
		return js.MakeWrapper(privkey)
	})

	// signature
	exports.Set("SignatureFromBytes", crypto.SignatureFromBytes)
	exports.Set("SignatureTypeEd25519", crypto.SignatureTypeEd25519)
	exports.Set("SignatureTypeSecp256k1", crypto.SignatureTypeSecp256k1)
	exports.Set("SignatureFromBytes", crypto.SignatureFromBytes)
	exports.Set("SignatureEd25519", func(bytes [64]byte) *js.Object {
		var privkey crypto.SignatureEd25519 = bytes
		return js.MakeWrapper(privkey)
	})
	exports.Set("SignatureSecp256k1", func(bytes []byte) *js.Object {
		var privkey crypto.SignatureSecp256k1 = bytes
		return js.MakeWrapper(privkey)
	})

	// random
	exports.Set("MixEntropy", crypto.MixEntropy)
	exports.Set("CRandBytes", crypto.CRandBytes)
	exports.Set("CRandHex", crypto.CRandHex)
	exports.Set("CReader", crypto.CReader)

	// symettric
	exports.Set("EncryptSymmetric", crypto.EncryptSymmetric)
	exports.Set("DecryptSymmetric", crypto.DecryptSymmetric)
}
