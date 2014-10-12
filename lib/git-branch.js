'use strict';
var shjs = require('shelljs')

module.exports.name = function() {
  var b = shjs.exec('git rev-parse --abbrev-ref HEAD', {
    silent: true
  }).output.trim()
  return b
}

module.exports.version = function() {
  var a = this.name()
  var b = /daily\/(\S+)/.exec(a)
  b = b && b[1];
  return b;
}
