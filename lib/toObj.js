var util = require('util')

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
    obj[item[0]] = item[1]
  };
  return obj
}
