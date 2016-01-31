var demoModel = {};

demoModel.test = function (req, res) {
  console.log('demoController action show 1');

  this.viewBag().test = '该属性由res.viewBag()函数添加';

  res.view({pageCode: 'demoShow', title: 'controller: demo, action: show', baseControllerInfo: this.baseControllerInfo}); //res.view()为guthrie框架扩展的方法

  //执行结果:
  //baseController actionExecuting 1
  //baseController actionExecuting 2
  //demoController actionExecuting 1
  //demoController actionExecuting 2
  //baseController baseFilterFunc 1
  //baseController baseFilterFunc 2
  //demoController demoFilterFunc 1
  //demoController demoFilterFunc 2
  //demoController action show 1
  //baseController actionExecuted 1
  //demoController actionExecuted 1
  //baseController resultExecuting 1
  //demoController resultExecuting 1
  //baseController resultExecuted 1
  //demoController resultExecuted 1
  //因此,guthrie框架的执行流程为:
  //事件actionExecuting => filters => 子controller的action => 事件actionExecuted => 事件resultExecuting => 事件resultExecuted
  //对于注册的同种类型的函数,总是先执行父controller上的,再执行子controller上的
  //父controller上定义的actions不执行
};

module.exports = demoModel;