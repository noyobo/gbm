'use strict';
var logger = require('./log');
var path = require('path')
var ver = require('semver')
var gitBranch = require('./git-branch')

var versionReg = /\d+\.\d+\.\d+/
var nameReg = /^(daily\/\d+\.\d+\.\d+|master)$/

var pkgPath = path.join(process.cwd(), 'package.json')
var pkg = require(pkgPath)

var branchName = gitBranch.name()
var branchNameVer = gitBranch.version() || pkg.version

var checkBranch = {
  equi: function() {
    if (ver.eq(pkg.version, branchNameVer)) {
      logger.warn('当前分支为 ' + branchName + ' 与 package.json 版本号一致，禁止修改.')
      return true
    }
    return false
  },
  version: function() {
    if (branchName !== 'master' && ver.neq(pkg.version, branchNameVer)) {
      logger.error('当前分支为 ' + branchName + ' 与 package.json 版本号不一致，请修改.')
      return false
    }
    return true
  },
  isBranch: function() {
    if (!nameReg.test(branchName)) {
      logger.error('分支名不符合','(master|daily/x.y.z)'.yellow,'请切换分支.')
      return false
    }
    return true
  },
  isMaster: function() {
    if (/master/.test(branchName)) {
      logger.warn('当前分支为','master'.green, '禁止 publish')
      return true
    }
    return false
  },
  isVer: function(version) {
    if (!versionReg.test(version)) {
      logger.warn('参数不符合', 'x.y.z'.green)
      return false
    }
    return true
  },
  gt: function(version) {
    if (!ver.gt(version, branchNameVer)) {
      logger.warn(version, '必须大于当前', branchNameVer)
      return false
    }
    return true
  }
}
module.exports = checkBranch
