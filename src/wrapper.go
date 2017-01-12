package main

import (
	"fmt"

	"github.com/tendermint/go-crypto"
)

func main() {
	fmt.Println(crypto.CRandHex(10))
}
