var utils = require('../common/utils');
var data = {
  a: 'test',
  b: {
    a: [1, 2, 3],
    b: {
      a: 1,
      b: 2
    }
  }
};
var mapModel = [
  ['a', 'result.a'],
  ['b', 'result.b'],
  ['b.b.a', 'result.b.c'],
  ['b.a', 'www.c.c']
];

var result = utils.mappingData(data, mapModel);

console.log(result);
//运行结果
//{
//  result: {
//    a: 'test',
//    b: { a: [Object], b: [Object],
//    c: 1 }
//  },
//  www: {
//    c: { c: [Object] }
//  }
// }