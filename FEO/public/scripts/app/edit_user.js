define(['jquery', '!domReady'], function ($) {

  var addUser = {
    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$btnSubmit = $('#btn-submit');
      self.$nickname = $('#nickname');
      self.$prePassword = $('#pre-password');
      self.$password = $('#password');
      self.$rePassword = $('#re-password');
      self.$errorInfo = $('#error-info');
    },
    bindEvent: function () {
      var self = this;

      self.$nickname.on('keypress', listenKeyPress);

      self.$prePassword.on('keypress', listenKeyPress);

      self.$password.on('keypress', listenKeyPress);

      self.$rePassword.on('keypress', listenKeyPress);

      self.$rePassword.on('blur', function () {
        if (self.checkRePassword()) {
          self.hideError();
        } else {
          self.showError('两次密码输入不一致!');
        }
      });

      self.$btnSubmit.on('click', function () {
        if (self.checkAllInput()) {
          self.hideError();
          var temp = self.getAllInput();
          $.ajax({
            url: '/user/edit',
            type: 'post',
            contentType: 'application/JSON',
            data: JSON.stringify(temp),
            dataType: 'json',
            success: function (res) {
              if (res.message === 'ok') {
                window.location.href = '/login';
              } else {
                self.showError(res.message);
              }
            }
          })
        }
      });

      function listenKeyPress(e) {
        if (e.keyCode === 13) {
          self.$btnSubmit.click();
          $(this).blur();
          e.preventDefault();
        }
      }

    },
    checkRePassword: function () {
      var self = this;
      var stamp = false;

      if ($.trim(self.$password.val()) === $.trim(self.$rePassword.val())) {
        stamp = true;
      }

      return stamp;
    },
    checkAllInput: function () {
      var self = this;
      var inputList = [self.$nickname, self.$prePassword, self.$password, self.$rePassword];
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

      if (!self.checkRePassword()) {
        self.showError('两次密码输入不一致!');
        return false;
      }

      return true;
    },
    getAllInput: function () {
      var self = this;
      var temp = {};
      temp.nickname = $.trim(self.$nickname.val());
      temp.prePassword = $.trim(self.$prePassword.val());
      temp.password = $.trim(self.$password.val());
      temp.rePassword = $.trim(self.$rePassword.val());

      return temp;
    },
    showError: function (text) {
      var self = this;

      self.$errorInfo.html(text).show();
    },
    hideError: function () {
      var self = this;

      self.$errorInfo.hide();
    }
  };

  addUser.init();

});