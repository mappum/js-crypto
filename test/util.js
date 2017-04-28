'use strict'

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const tmp = require('tmp')

function goBuild (code, encoding) {
  let sourceFile = tmp.fileSync({ postfix: '.go' })
  let binaryFile = tmp.fileSync()
  writeFileSync(sourceFile.name, code)
  execSync(`go build -o ${binaryFile.name} ${sourceFile.name}`)
  sourceFile.removeCallback()
  return (...args) => execSync(`${binaryFile.name} ${args.join(' ')}`)
}

module.exports = {
  goBuild
}
