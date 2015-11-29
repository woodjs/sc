requirejs.config({
  baseUrl: '/js/private',
  paths: {
    //public
    jquery: '../jquery/jquery-2.1.4.min',
    domReady: '../requirejs/domReady',
    //private
    addUser: './add_user'
  }
});

require(requiredModuleList || 'jquery');