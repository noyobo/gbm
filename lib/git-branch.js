const shjs = require('shelljs')

module.exports = shjs.exec('git rev-parse --abbrev-ref HEAD', {
  silent: true
}).output
