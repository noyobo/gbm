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
  switch: 'git checkout $message',
  tag: 'git tag publish/$message',
  nowbranch: 'git rev-parse --abbrev-ref HEAD',
  prepub: 'git push origin $message:$message',
  publish: 'git push origin publish/$message:publish/$message'
}

gbm.new = function(version, release) {
  if (!check.isBranch()) {
    process.exit(1)
  }
  if (branchName === 'master') {
    if (typeof version === 'undefined') {
      this._createBranch(ver.inc(pkg.version, release))
    } else {
      if (check.isVer(version)) {
        this._createBranch(version)
      }
    }
  } else {
    if (typeof version === 'undefined') {
      this._createBranch(ver.inc(branchNameVer, release))
    } else {
      if (check.isVer(version)) {
        this._createBranch(version)
      }
    }
  }
}
gbm.bump = function(type) {
    if (!check.isVersion(pkg.version)) {
      logger.warn('当前 package.json version 不符合', 'x.y.z'.green)
      process.exit(1)
    }
    this._writePackage(type)
  }
  // 更新版本号 并 commit
gbm.parser = function(val) {
    var pkg = require(pkgPath)
    var flag = false
    if (!check.isBranch()) {
      process.exit(1)
    }
    if (!check.isVer(val)) {
      process.exit(1)
    }
    if (val === pkg.version) {
      logger.info('当前 package.version 已为', val.green)
      return false
    }
    if (branchName === 'master') {
      if (check.gt(val)) {
        flag = true
      }
    } else {
      if (!check.equi(val) && check.gt(val)) {
        flag = true
      }
    }
    if (!flag) {
      return false
    }
    this._writeVersion(val)
  }
  // 推送分支
gbm.prepub = function() {
  if (!check.isBranch()) {
    process.exit(1)
  }
  if (!check.version) {
    process.exit(1)
  }
  logger.info('当前推送分支', branchName.green)
  var n = branchName === 'master' ? branchName : 'daily/' + branchNameVer
  shjs.exec(commands.prepub.msg(n) + '&&' + commands.status, {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code !== 0) {
      logger.error('推送失败');
    }
  }).stdout.on('data', function(data) {
    if (nothingReg.test(data)) {
      logger.log('Everything up-to-date'.green)
    } else {
      logger.warn('分支剩余文件未提交')
    }
  })
}
gbm.publish = function() {
  if (check.isMaster()) {
    logger.warn('当前分支为', 'master'.green, '禁止 publish')
    process.exit(1)
  }
  if (!check.isBranch()) {
    process.exit(1)
  }
  if (!check.version) {
    process.exit(1)
  }
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
gbm.commit = function(message) {
  if (!check.isBranch()) {
    process.exit(1)
  }
  if (!check.version) {
    process.exit(1)
  }
  message = message.replace(/[-_]+/g, ' ')
  shjs.exec(commands.add + '&&' + commands.commit.msg(message))
}
gbm.switch = function(val) {
  if (val === 'master') {
    shjs.exec(commands.switch.msg(val))
    process.exit()
  }
  if (check.isVer(val)) {
    shjs.exec(commands.switch.msg('daily/' + val))
  }
}
gbm.check = function() {
  if (!check.isBranch()) {
    process.exit(1)
  }
  logger.info('now package.version:', pkg.version.green)
}
gbm.sync = function() {
  if (check.isBranch()) {
    var a = gitBranch.version()
    gbm.parser(a)
  }
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
gbm._writeVersion = function(val) {
  pkg.version = val
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  shjs.exec(commands.addpkg + '&&' + commands.commit.msg('v' + pkg.version), {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code === 0) {
      logger.info('package.version 更新到', pkg.version.green)
    }
  })
}
gbm._writePackage = function(type) {
  var pkg = require(pkgPath)
  var old = pkg.version;
  var val = ver.inc(pkg.version, type)
  pkg.version = val
  fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), function(err) {
    if (err) {
      logger.error('could not increase version: ' + pkg.version)
    }
    logger.info('package.version', old.yellow, '=>', val.green)
    logger.tips('package.json 已更新', '需自行 commit')
  });
}
gbm._setPkgpath = function(url) {
  pkgPath = url;
}
