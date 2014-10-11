var util = require('util')
var comm = require('./commands')
var indexof = require('lodash.indexof')

function isOwnEmpty(obj) {
  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};

module.exports = function(array) {
  if (!util.isArray(array)) {
    return null
  };
  if (array.length === 0) {
    return null
  };
  var obj = {};
  for (var i = array.length - 1; i >= 0; i--) {
    var item = array[i].split(':')
    if (indexof(comm.names, item[0]) !== -1) {
      obj[item[0]] = item[1] || true;
    };
  };
  if (isOwnEmpty(obj)) {
    return null
  };
  return obj
}
