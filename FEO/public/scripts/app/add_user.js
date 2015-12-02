define(['jquery', 'ajax', '!domReady'], function ($, ajax) {

  var addUser = {
    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$createdUserList = $('#box-user-show span');
      self.$btnSubmit = $('#btn-submit');
      self.$username = $('#username');
      self.$nickname = $('#nickname');
      self.$password = $('#password');
      self.$rePassword = $('#re-password');
      self.$errorInfo = $('#error-info');
    },
    bindEvent: function () {
      var self = this;
      self.$username.on('keypress', listenKeyPress);

      self.$password.on('keypress', listenKeyPress);

      self.$nickname.on('keypress', listenKeyPress);

      self.$rePassword.on('keypress', listenKeyPress);

      self.$username.on('blur', function () {
        var $temp = $(this);

        if (self.isUserCreated()) {
          self.showError('该用户名已被占用!');
        } else {
          self.hideError();
        }
      });

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
          ajax.invoke({
            url: '/user/add',
            type: 'post',
            contentType: 'application/JSON',
            data: JSON.stringify(temp),
            dataType: 'json',
            success: function (res) {
              if (res.status === 200) {
                window.location.reload();
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
    isUserCreated: function () {
      var self = this;
      var username = $.trim(self.$username.val());
      var stamp = false;

      self.$createdUserList.each(function (index, object, arr) {
        var $temp = $(object);

        if ($temp.data('username') === username) {
          stamp = true;
        }
      });

      return stamp;
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
      var inputList = [self.$username, self.$nickname, self.$password, self.$rePassword];
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

      if (self.isUserCreated()) {
        self.showError('该用户名已被占用!');
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
      temp.username = $.trim(self.$username.val());
      temp.nickname = $.trim(self.$nickname.val());
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