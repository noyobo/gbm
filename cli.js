#! /usr/bin/env node

'use strict';
var colors = require('colors')
var program = require('commander')
var pkg = require('./package.json')
var updateNotifier = require('update-notifier')

// var logger = require('./lib/log')
// var help = require('./lib/help')
var gbm = require('./index')

function getType() {
  var type = (!!program.major && 'major') || (!!program.minor && 'minor') || (!!program.patch && 'patch') || 'minor'
  return type;
}

var notifier = updateNotifier({
  packageName: pkg.name,
  packageVersion: pkg.version
})
notifier.notify()

program
  .version(pkg.version)
  .usage(colors.yellow('<commands> [options]'))
  .option('-M, --major', '主版本号增加 Eg. 1.0.2 -> 2.0.0')
  .option('-m, --minor', '次版本号增加 ' + 'default'.yellow + ' Eg. 1.0.2 -> 1.1.0')
  .option('-p, --patch', '补丁版本号增加 Eg. 1.0.2 -> 1.0.3')

program
  .command('new [x.y.z|options]')
  .alias('n')
  .description('创建新分支')
  .action(function(val) {
    gbm.new(val, getType())
  })
program
  .command('bump [options]')
  .alias('b')
  .description('增加当前版本号')
  .action(function() {
    gbm.bump(getType())
  })
program
  .command('parser <x.y.z>')
  .alias('p')
  .description('更新当前版本号 and commit')
  .action(function(val) {
    gbm.parser(val || getType())
  })
program
  .command('commit <message>')
  .alias('c')
  .description('添加所有变更文件 and commit')
  .action(function(val) {
    gbm.commit(val)
  })
program
  .command('switch <x.y.z>')
  .alias('s')
  .description('切换分支到 daily/x.y.z')
  .action(function(val) {
    gbm.switch(val)
  })
program
  .command('prepub')
  .description('推送当前分支到远端')
  .action(function() {
    gbm.prepub()
  })
program
  .command('publish')
  .description('发布当前分支资源')
  .action(function() {
    gbm.publish()
  })

program
  .command('sync')
  .description('同步当前版本号')
  .action(function() {
    gbm.sync()
  })
program
  .command('now')
  .description('显示当前文件配置信息')
  .action(function() {
    gbm.check()
  })
program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
  process.exit(1)
}
