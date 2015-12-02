define(['jquery', 'ajax', '!domReady'], function ($, ajax) {

  var login = {
    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$btnLogin = $('#btn-login');
      self.$username = $('#username');
      self.$password = $('#password');
      self.$lineError = $('#line-error');
    },
    bindEvent: function () {
      var self = this;

      self.$username.on('keypress', listenKeyPress);

      self.$password.on('keypress', listenKeyPress);

      self.$btnLogin.on('click', function () {
        if (self.checkAllInput()) {
          self.hideError();
          var temp = self.getAllInput();
          ajax.invoke({
            url: '/login',
            type: 'post',
            contentType: 'application/JSON',
            data: JSON.stringify(temp),
            dataType: 'json',
            success: function (res) {
              if (res.status === 200) {
                window.location.href = '/optimize';
              } else {
                self.showError(res.message);
              }
            }
          });
        }
      });

      function listenKeyPress(e) {
        if (e.keyCode === 13) {
          self.$btnLogin.click();
          $(this).blur();
          e.preventDefault();
        }
      }
    },
    checkAllInput: function () {
      var self = this;
      var inputList = [self.$username, self.$password];
      var stamp = true;
      inputList.forEach(function (object, index, arr) {
        var value = $(object).val();
        if ($.trim(value) === '') {
          stamp = false;
          self.showError('尚有条目未填写,请检查各项!');
        }
      });

      if (!stamp) {
        return false;
      }

      return true;
    },
    getAllInput: function () {
      var self = this;
      var temp = {};
      temp.username = $.trim(self.$username.val());
      temp.password = $.trim(self.$password.val());

      return temp;
    },
    showError: function (text) {
      var self = this;

      self.$lineError.html(text);
    },
    hideError: function () {
      var self = this;

      self.$lineError.html('');
    }
  };

  login.init();

});