#! /usr/bin/env node

const colors = require('colors')
const program = require('commander')
const shjs = require('shelljs')
const path = require('path')
const pkg = require('./package.json')

var logger = require('./lib/log')
var branchName = require('./lib/git-branch')
var toObj = require('./lib/toObj');
var help = require('./lib/help')

var localPkg = require(path.join(process.cwd(), 'package.json'))


program
  .version(pkg.version)
  .usage('[options] [value ...]')
  .option('-x, --major', 'version major +1')
  .option('-y, --minor', 'version minor +1')
  .option('-z, --patch', 'version patch +1')

program.on('--help', function() {
  help.show();
})

program.parse(process.argv)

logger.log(program.major)

if (!program.args.length && !program.major) {
  program.help()
  process.exit()
};

var inputArgs = toObj(program.args);

logger.log(inputArgs, program.major)
