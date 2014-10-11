var util = require('util')

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
    if (item.length == 2) {
      obj[item[0]] = item[1]
    };
  };
  if (isOwnEmpty(obj)) {
    return null
  };
  return obj
}
