require(['ajax', 'jqExtend', 'jquery','header'], function(ajax) {
  var login = {
    init: function() {
      var self = this;

      self.initEls();
      self.initEvents();
    },

    initEls: function() {
      var self = this;

      self.$userCenters = $('.user-center-list').children();
      self.$userCenterDetalis = $('.user-center-detail').children();
    },

    initEvents: function() {
      var self = this;
      
      self.$userCenters.each(function(i){
        $(this).on("click",function(){
          self.$userCenters.removeClass('active');
            $(this).addClass('active');
        })
      })
      
    }
}
  login.init();
})