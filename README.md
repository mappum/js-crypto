# tendermint-crypto
JS equivalent of Tendermint's [go-crypto](https://github.com/tendermint/go-crypto) package.

### usage

```
npm install tendermint-crypto
```

```js
let { PrivKey, PubKey } = require('tendermint-crypto')

// generate a keypair
let priv = PrivKey.generate('ed25519')
let pub = priv.pubkey()

let message = 'message to sign'
let sig = priv.sign(message) 
let isValid = pub.verify(sig, message) // true
```


