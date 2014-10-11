var logger = require('./log.js')


var command = [
    {
      name : 'new',
      args : 'new[:branch]',
      desc : 'Create and Switch a new branch'
    }
  ]

module.exports.show = function(){
  console.log('  Commands:')
  console.log('')
  console.log('    new,', 'check a new branch')
  console.log('')
}

module.exports.showCommands = function(){

}
