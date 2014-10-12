'use strict';
var logger = require('./log');
var path = require('path')
var ver = require('semver')
var gitBranch = require('./git-branch')

var branchName = gitBranch.name()
var branchNameVer = gitBranch.version()

var versionReg = /\d+\.\d+\.\d+/

var pkgPath = path.join(process.cwd(), 'package.json')
var pkg = require(pkgPath)

var checkBranch = {
  checkVersion: function() {
    this.name()
    this.version()
  },
  version: function() {
    if (branchNameVer !== pkg.version && branchName !== 'master') {
      logger.error('当前分支为 ' + branchName + ' 与 package.json 版本号不一致，请修改.')
      process.exit()
    }
  },
  name: function() {
    if (!branchName) {
      logger.error('分支名不合法(daily/x.y.z)，请切换到daily分支')
      process.exit()
    }
  },
  lint: function(version) {
    if (!versionReg.test(version)) {
      logger.warn('参数不符合', 'x.y.z'.green)
      process.exit()
    }
  },
  gte: function(version) {
    if (!ver.gte(version, branchNameVer)) {
      logger.warn(version, '小于当前分支', branchNameVer)
      process.exit()
    }
  }
}
module.exports = checkBranch