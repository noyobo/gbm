'use strict';

var colors = require('colors');
var date = require('dateformat');

module.exports = {
  log: function() {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
    return this;
  },
  out: function() {
    var time = '[' + colors.grey(date(new Date(), 'HH:MM:ss')) + ']';
    var args = Array.prototype.slice.call(arguments);
    args.unshift(time);
    console.log.apply(console, args);
    return this;
  },
  error: function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(colors.red('Error:'))
    console.error.apply(console, args);
    return this;
  },
  info: function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(colors.cyan('Info:'))
    console.info.apply(console, args);
    return this;
  },
  warn: function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(colors.yellow('Warn:'))
    console.warn.apply(console, args);
    return this;
  },
  tips: function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(colors.green('Tips:'))
    console.warn.apply(console, args);
    return this;
  }
}
