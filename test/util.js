'use strict'

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const tmp = require('tmp')

function goEval (code) {
  let tmpFile = tmp.fileSync({ postfix: '.go' })
  writeFileSync(tmpFile.name, code)
  let output = execSync(`go run ${tmpFile.name}`).toString()
  tmpFile.removeCallback()
  return output
}

module.exports = {
  goEval
}
