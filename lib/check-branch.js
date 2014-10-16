'use strict';
var logger = require('./log');
var ver = require('semver');

var nameReg = /^(daily\/\d+\.\d+\.\d+|master)$/;

var checkBranch = {
  isBranch: function(branchName) {
    if (!nameReg.test(branchName)) {
      logger.error('分支名不符合', '(master|daily/x.y.z)'.yellow, '请切换分支.');
      return false;
    }
    return true;
  },
  isMaster: function(name) {
    if (/\bmaster\b/.test(name)) {
      return true;
    }
    return false;
  },
  isDaily: function(name) {
    if (/^(daily\/\d+\.\d+\.\d+)$/.test(name)) {
      return true;
    }
    return false;
  },
  isVersion: function(val) {
    if (!/\d+\.\d+\.\d+/.test(val)) {
      return false;
    }
    return true;
  },
  isVer: function(version) {
    if (!/\d+\.\d+\.\d+/.test(version)) {
      logger.warn('参数不符合', 'x.y.z'.green);
      return false;
    }
    return true;
  },
  isBump: function(val) {
    if (/(major|minor|patch)/.test(val)) {
      return true;
    }
    return false;
  },
  gte: function(v1, v2) {
    if (!ver.gte(v1, v2)) {
      logger.warn(v1, '不得小于', v2);
      return false;
    }
    return true;
  },
  neq: function(name, v2) {
    if (name !== 'master') {
      var v1 = /daily\/(\S+)/.exec(name)[1];
      if (ver.neq(v1, v2)) {
        logger.error('当前分支为 ' + name + ' 与 package.json 版本号不一致，请修改.');
        logger.tips('运行', 'gbm sync'.green, '同步版本号');
        return false;
      }
      return true;
    }
    return true;
  }
};
module.exports = checkBranch;
