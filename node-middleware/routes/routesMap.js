var initRoutesMap = function (router) {

  router.mapRoute('/:controller/:action?');

  router.mapRoute('/', {
    controller: 'demo',
    action: 'index'
  });
};

module.exports = initRoutesMap;