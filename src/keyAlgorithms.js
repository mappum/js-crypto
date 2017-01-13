let { keys } = Object
let assign = require('object-assign')
let crypto = require('../build/go-crypto.js')

module.exports = function (type) {
  // get all symbols exported by the golang wrapper which contain `match`
  function getSymbols (match) {
    let symbols = {}
    for (let key of keys(crypto)) {
      if (!key.includes(match)) continue
      let name = key.replace(match, '')
      let value = crypto[key]
      symbols[name] = value
    }
    return symbols
  }

  // get all key algorithms exported by the golang wrapper,
  // and all of their relevant exported fucntions/symbols
  const algorithms = {
    get (algo) {
      let algorithm = algorithms[algo.toLowerCase()]
      if (algorithm == null) {
        throw new Error(`Unsupported key algorithm: "${algo}"`)
      }
      return algorithm
    }
  }
  for (let name of keys(getSymbols(type + 'Type'))) {
    let symbols = getSymbols(type + name)
    let algo = symbols['']
    delete algo['']
    assign(algo, { id: name }, symbols)
    algorithms[name.toLowerCase()] = algo
  }
  return algorithms
}
