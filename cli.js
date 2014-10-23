#! /usr/bin/env node
'use strict';
var colors = require('colors');
var program = require('commander');
var shjs = require('shelljs');
var confirm = require('confirm-simple');
var pkg = require('./package.json');
var update = require('update-npm');
var gbm = require('./index.js');

function getType() {
  var type = (!!program.major && 'major') || (!!program.minor && 'minor') || (!!program.patch && 'patch') || 'minor';
  return type;
}

function branch(cb) {
  shjs.exec('git rev-parse --abbrev-ref HEAD', {
    silent: true
  }, function(code, out) {
    if (code === 0) {
      cb(out.trim());
    }
  });
}

update.notify(pkg.name, pkg.version);

program
  .version(pkg.version)
  .usage(colors.yellow('<commands> [options]'))
  .option('-M, --major', '主版本号增加 Eg. 1.0.2 -> 2.0.0')
  .option('-m, --minor', '次版本号增加 ' + 'default'.yellow + ' Eg. 1.0.2 -> 1.1.0')
  .option('-p, --patch', '补丁版本号增加 Eg. 1.0.2 -> 1.0.3');

program.name = 'gbm';

program
  .command('new [x.y.z|options]')
  .alias('n')
  .description('创建新分支')
  .action(function(val) {
    branch(function(name) {
      gbm.new(name, val || getType());
    });
  });
program
  .command('bump [options]')
  .alias('b')
  .description('增加当前版本号')
  .action(function() {
    gbm.bump(getType());
  });
program
  .command('commit <message>')
  .alias('c')
  .description('添加所有变更文件 and commit')
  .action(function(message) {
    branch(function(name) {
      gbm.commit(name, message);
    });
  });
program
  .command('switch <x.y.z>')
  .alias('s')
  .description('切换分支到 daily/x.y.z')
  .action(function(val) {
    gbm.switch(val);
  });
program
  .command('set <x.y.z>')
  .description('设置当前版本号')
  .action(function(val) {
    branch(function(name) {
      gbm.parser(name, val);
    });
  });
program
  .command('get')
  .description('获取当前版本号')
  .action(function() {
    branch(function(name) {
      gbm.now(name);
    });
  });
program
  .command('push')
  .alias('prepub')
  .description('推送当前分支到远端')
  .action(function() {
    branch(function(name) {
      gbm.prepub(name);
    });
  });
program
  .command('pull')
  .description('拉取当前分支到远端')
  .action(function() {
    branch(function(name) {
      gbm.pull(name);
    });
  });
program
  .command('publish')
  .description('发布当前分支资源')
  .action(function() {
    confirm('你确定发布当前分支吗? 此操作不可逆!', ['yes', 'no'], function(ok) {
      if (ok) {
        branch(function(name) {
          gbm.publish(name);
        });
      }
    });
  });
program
  .command('sync')
  .description('同步当前版本号')
  .action(function() {
    branch(function(name) {
      gbm.sync(name);
    });
  });
program
  .command('up')
  .alias('upgrade')
  .description('检查 gbm 更新')
  .action(function() {
    update.upgrade(pkg.name, pkg.version);
  });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
  process.exit();
}
