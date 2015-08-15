'use strict';
var shjs = require('shelljs');
var path = require('path');
var ver = require('semver');
var fs = require('fs');

var pkgPath = path.join(process.cwd(), 'package.json');
var logger = require('./lib/log');
var check = require('./lib/check-branch');
var gbm = module.exports = {};

String.prototype.msg = function(msg) {
  return this.replace(/\$message/g, msg);
};
var nothingReg = /nothing to commit/gm;
var pkg = gbm.pkg = null;
if (fs.existsSync(pkgPath)) {
  pkg = gbm.pkg = require(pkgPath);
}

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
  pull: 'git pull origin $message:$message',
  publish: 'git push origin publish/$message:publish/$message'
};

gbm.new = function(name, val) {
  this._checkPackage()
  if (!check.isBranch(name)) {
    return false;
  }
  if (check.isVersion(val)) {
    this._createBranch(val);
  }
  if (check.isBump(val)) {
    var m = /^daily\/(\d+\.\d+\.\d+)$/.exec(name)
    var v = (m && m[1]) || pkg.version;
    this._createBranch(ver.inc(v, val));
  }
};
gbm.bump = function(type) {
  this._checkPackage()
  var v = pkg.version;
  if (check.isVersion(v)) {
    v = ver.inc(v, type);
    this._writePackage(v, function() {
      logger.info('package.version =>', v.green);
    });
  } else {
    logger.error('package.version required x.y.z', v.green);
  }
};
gbm.parser = function(name, v) {
  this._checkPackage()
  if (check.isBranch(name) && check.isVer(v) && check.gte(v, pkg.version)) {
    this._writePackage(v, function() {
      logger.info('package.version =>', v.green);
    });
  }
};
gbm.commit = function(name, message) {
  this._checkPackage()
  if (!check.isBranch(name)) {
    return false;
  }
  if (!check.neq(name, pkg.version)) {
    return false;
  }
  message = message.replace(/[-_]+/g, ' ');
  shjs.exec(commands.add + '&&' + commands.commit.msg(message));
};
gbm.sync = function(name) {
  this._checkPackage()
  if (check.isDaily(name)) {
    var v = /^daily\/(\d+\.\d+\.\d+)$/.exec(name)[1];
    this._writePackage(v, function() {
      logger.info('package.version =>', v.green);
    });
  } else {
    logger.warn('当前分支不为', 'daily/x.y.z'.magenta);
  }
};
gbm.switch = function(val) {
  this._checkPackage()
  if (val === 'master') {
    shjs.exec(commands.switch.msg(val));
    return false;
  }
  if (check.isVer(val)) {
    shjs.exec(commands.switch.msg('daily/' + val));
  }
};
gbm.now = function(name) {
  this._checkPackage()
  if (!check.isBranch(name)) {
    return false;
  }
  logger.info('now package.version:', pkg.version.green);
};
gbm.prepub = function(name) {
  this._checkPackage()
  if (!check.isBranch(name)) {
    return false;
  }
  if (!check.neq(name, pkg.version)) {
    return false;
  }
  logger.info('当前推送分支', name.green);
  shjs.exec(commands.prepub.msg(name) + '&&' + commands.status, {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code !== 0) {
      logger.error('推送失败');
    }
  }).stdout.on('data', function(data) {
    if (nothingReg.test(data)) {
      logger.log('Everything up-to-date'.green);
    } else {
      logger.warn('分支剩余文件未提交');
    }
  });
};
gbm.pull = function(name) {
  this._checkPackage()
  if (!check.isBranch(name)) {
    return false;
  }
  if (!check.neq(name, pkg.version)) {
    return false;
  }
  logger.info('当前拉取分支', name.green);
  shjs.exec(commands.pull.msg(name) + '&&' + commands.status, {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code !== 0) {
      logger.error('拉取失败');
    } else {
      logger.info('拉取成功');
    }
  })
}
gbm.publish = function(name) {
  this._checkPackage()
  if (check.isMaster(name)) {
    logger.warn('当前分支为', 'master'.green, '禁止 publish');
    return false;
  }
  if (!check.isBranch(name)) {
    return false;
  }
  if (!check.neq(name, pkg.version)) {
    return false;
  }
  console.log(name)
  var m = /^daily\/(\d+\.\d+\.\d+)$/.exec(name)
  var v;
  if (m) {
    v = m && m[1];
  } else {
    logger.error('版本号错误...');
    return false;
  }
  logger.info('当前推送Tag =>', ('publish/' + v).green);
  shjs.exec(commands.tag.msg(v) + '&&' + commands.publish.msg(v), {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code === 0) {
      logger.info('发布完成');
    } else {
      logger.error('发布失败...');
    }
  });
};

/**
 * 创建分支
 * @param  {x.y.z} version 分支号
 * @private
 */
gbm._createBranch = function(version) {
  shjs.exec(commands.createBranch.msg(version), {
    silent: false,
    async: true
      /*jshint unused:false*/
  }, function(code, output) {
    if (code === 0) {
      var branch = /daily\/\d+\.\d+\.\d+/.exec(output)[0];
      if (branch) {
        gbm.sync(branch);
      }
    }
  });
};

/**
 * 写入 package.json 版本
 * @param  {x.y.z}   v 版本号
 * @param  {Function} cb 回调
 */
gbm._writePackage = function(v, cb) {
  pkg.version = v;
  fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), function(err) {
    if (err) {
      throw new Error('could not write package.json version to : ' + pkg.version);
    }
    cb();
  });
};

gbm._checkPackage = function() {
  if (!this.pkg) {
    logger.info(process.cwd(), '不存在 package.json')
    process.exit(1)
  }
}
