var initRoutesMap = function (router) {

  router.mapRoute('/:controller/:action?');

  //// @url(/demo)
  //router.mapRoute('/demo/1', {
  //  controller: 'demo',
  //  action: 'show'
  //});
  //
  //router.mapRoute('/test', {
  //  controller: 'demo',
  //  action: 'test'
  //});

};

module.exports = initRoutesMap;