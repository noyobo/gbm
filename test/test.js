var assert = require('assert');
var path = require('path')
var gbm = require('../index')

describe('gbm testing', function() {
  var options = {
    cwd: __dirname
  };
  var temp = path.join(options.cwd + '/temp');
  var pkgPath = path.join(temp, 'package.json')
  gbm._setPkgpath(pkgPath)

  describe('gbm bump', function() {
    it('get local package.json version', function() {
      var pkg = require(pkgPath)
      assert.equal(pkg.version, '0.0.0')
    })
    it('bump patch', function() {
      gbm.bump('patch')
      var pkg = require(pkgPath)
      assert.equal(pkg.version, '0.0.1')
    });
    it('bump minor', function() {
      gbm.bump('minor')
      var pkg = require(pkgPath)
      assert.equal(pkg.version, '0.1.0')
    });
    it('bump major', function() {
      gbm.bump('major')
      var pkg = require(pkgPath)
      assert.equal(pkg.version, '1.0.0')
    });
  });
  // describe('gbm parser', function() {
  //   it('parser equal', function() {
  //     var value = gbm.parser('1.0.0')
  //     assert.equal(true, !value);
  //   });
  //   it('parser lt', function() {
  //     var value = gbm.parser('0.0.1')
  //     assert.equal(true, !value);
  //   });
  // });
})
