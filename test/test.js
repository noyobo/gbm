var assert = require('assert');
var path = require('path')
var gbm = require('../index')

describe('gbm testing', function () {
  var options = {cwd: __dirname};
  var temp = path.join(options.cwd + '/temp');
  var pkgPath = path.join(temp, 'package.json')
  var pkg = require(pkgPath)


})
