var utils = {};
var NO_VALID_URLS = ['/login', '/register', '/demo/index', '/demo/show'];

utils.isNeedValid = function (url) {
  return NO_VALID_URLS.indexOf(url) === -1 ? true : false;
};

/**
 * 映射数据
 *
 * @param {Object} source
 * @param {Array} mapModel
 * mapModel = [['a', 'b'], ['abc.a', 'www.b']];
 * mapModel数组中每个数组项的第一个值为原对象的属性，第二个值是目标对象的属性
 * @return {Object} target
 */
utils.mappingData = function (source, mapModel) {
  var target = {};

  if (mapModel && mapModel.forEach) {
    for (var i = 0; i < mapModel.length; i++) {
      var tempModel = mapModel[i];
      var value = eval('source.' + tempModel[0]);
      var props = tempModel[1].split('.');

      createObj(target, 0, props, value);
    }

    return target;
  } else {
    return source;
  }

  function createObj(obj, index, arr, value) {
    if (index === arr.length - 1) {
      return obj[arr[index]] = value;
    } else {
      if (!obj[arr[index]]) {
        obj[arr[index]] = {};
      }

      return createObj(obj[arr[index]], index + 1, arr, value);
    }
  }
};

module.exports = utils;