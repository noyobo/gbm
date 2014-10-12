#! /usr/bin/env node

'use strict';
var colors = require('colors')
var program = require('commander')
var pkg = require('./package.json')

// var logger = require('./lib/log')
// var help = require('./lib/help')
var gbm = require('./index')

function getType() {
  var type = (!!program.major && 'major') || (!!program.minor && 'minor') || (!!program.patch && 'patch') || 'minor'
  return type;
}

program
  .version(pkg.version)
  .usage(colors.yellow('<commands> [options]'))
  .option('-x, --major', '主版本号增加')
  .option('-y, --minor', '次版本号增加 default')
  .option('-z, --patch', '补丁版本号增加')

program
  .command('new [x.y.z|options]')
  .description('创建新分支')
  .action(function(val) {
    gbm.new(val, getType())
  })
program
  .command('ver [x.y.z|options]')
  .description('更新当前版本号 adn commit')
  .action(function(val) {
    gbm.ver(val || getType())
  })
program
  .command('commit <message>')
  .description('添加所有变更文件 and commit')
  .action(function(val) {
    gbm.commit(val)
  })
program
  .command('switch <x.y.z>')
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
  .command('check')
  .description('检验当前文件配置')
  .action(function() {
    gbm.check()
  })
program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
  process.exit(1)
}
