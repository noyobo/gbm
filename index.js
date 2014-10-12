'use strict';
var shjs = require('shelljs')
var path = require('path')
var ver = require('semver')
var fs = require('fs')
var logger = require('./lib/log');
var check = require('./lib/check-branch')
var gitBranch = require('./lib/git-branch')
  //*********************
var pkgPath = path.join(process.cwd(), 'package.json')
var pkg = require(pkgPath)
var branchName = gitBranch.name()
var branchNameVer = gitBranch.version()
  //*********************
var gbm = module.exports = {}

String.prototype.msg = function(msg) {
  return this.replace(/\$message/g, msg)
}
var nothingReg = /nothing to commit/gm;

var commands = {
  add: 'git add -A',
  addpkg: 'git add package.json',
  branch: 'git branch',
  createBranch: 'git checkout -b daily/$message',
  commit: 'git commit -m "$message"',
  status: 'git status',
  switch: 'git checkout daily/$message',
  tag: 'git tag publish/$message',
  nowbranch: 'git rev-parse --abbrev-ref HEAD',
  prepub: 'git push origin ' + branchName + ':' + branchName,
  publish: 'git push origin publish/$message:publish/$message'
}


gbm.new = function(version, release) {
  if (version !== undefined) {
    check.lint(version)
    check.gt(version)
    if (branchName === 'master') {
      this._createBranch(ver.inc(pkg.version, release))
    } else {
      this._createBranch(version)
    }
  } else {
    this._createBranch(ver.inc(branchNameVer, release))
  }
};
// 更新版本号 并 commit
gbm.ver = function(release) {
  if (release === pkg.version) {
    logger.info('当前 package.version 已为', release.green)
    process.exit(1)
  }
  if (/\b(major|minor|patch)\b/.test(release)) {
    check.checkVersion()
    pkg.version = ver.inc(pkg.version, release)
  } else {
    check.lint(release)
    check.gte(release)
    pkg.version = release
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  logger.info('package.version 更新到', pkg.version.green)
  shjs.exec(commands.addpkg + '&&' + commands.commit.msg('v' + pkg.version), {
    silent: true,
    async: true
  }).stdout.on('data', function(data) {
    logger.log(data)
  })
};
// 推送分支
gbm.prepub = function() {
  check.checkVersion()
  logger.info('当前推送分支', branchName.green)
  shjs.exec(commands.prepub + '&&' + commands.status, {
    silent: true,
    async: true
    /*jshint unused:false*/
  }, function(code, output) {
    if (code !== 0) {
      return logger.error(output);
    }
  }).stdout.on('data', function(data) {
    if (nothingReg.test(data)) {
      logger.log('Everything up-to-date')
    } else {
      logger.warn('分支剩余文件未提交')
    }
  })
};
gbm.publish = function() {
  check.checkVersion()
  var a = gitBranch.version()
  shjs.exec(commands.tag.msg(a) + '&&' + commands.publish.msg(a), {
    silent: false,
    async: true
    /*jshint unused:false*/
  }, function(code, output) {
    if (code === 0) {
      logger.info('发布完成')
    } else {
      logger.error('发布失败...')
    }
  })
}
gbm.commit = function(message){
  check.checkVersion()
  message = message.replace(/[-_]+/g, ' ')
  shjs.exec(commands.add + '&&' + commands.commit.msg(message))
}
gbm.switch = function(val){
  check.lint(val)
  shjs.exec(commands.switch.msg(val))
}
gbm.check = function() {
  check.checkVersion()
  logger.info('Good joy ^_^'.yellow)
}
gbm.sync = function() {
  check.name()
  var a = gitBranch.version()
  gbm.ver(a)
}
gbm._createBranch = function(version) {
  shjs.exec(commands.createBranch.msg(version), {
    silent: false,
    async: true
    /*jshint unused:false*/
  }, function(code, output) {
    if (code === 0) {
      gbm.sync()
    }
  })
}
