define(['jquery', 'easyDialog', 'ejs', '!domReady'], function ($) {

  var manageUser = {
    init: function () {
      var self = this;

      self.buildElement();
      self.buildTpl();
      self.bindEvent();
    },
    buildElement: function () {
      var self = this;

      self.$inputSearch = $('#input-search');
      self.$btnSearch = $('#btn-search');
      self.$btnShowAll = $('#btn-show-all');
      self.$btnAuthList = $('.normal .btn-auth');
      self.$btnDeleteList = $('.normal .btn-delete');
      self.$btnResetList = $('.normal .btn-reset');
      self.$tbodyUserList = $('#tbody-user-list');
    },
    buildTpl: function () {
      var self = this;

      self.tplList = $('#tpl-user-list').html();
      self.$tplAuth1 = $('#tpl-auth-1').html();
      self.$tplAuth2 = $('#tpl-auth-2').html();
    },
    bindEvent: function () {
      var self = this;

      self.$inputSearch.on('keypress', listenKeyPress);

      self.$btnSearch.on('click', function () {
        if (self.checkInput()) {
          var data = {
            type: 'some',
            search: self.getInput()
          };
          self.searchAjax(data, function (res) {
            self.$tbodyUserList.html(self.renderList(res));
            self.reBindEvent();
          });
        } else {
          self.showError('请输入用户昵称!');
        }
      });

      self.$btnShowAll.on('click', function () {
        var data = {
          type: 'all',
          search: self.getInput()
        };
        self.searchAjax(data, function (res) {
          self.$tbodyUserList.html(self.renderList(res));
          self.reBindEvent();
        });
      });

      self.$btnAuthList.on('click', function () {
        var $temp = $(this);
        var username = $temp.data('username');
        var role = $temp.data('role');
        var text = role ? self.$tplAuth2 : self.$tplAuth1;

        var data = {
          type: 'auth',
          username: username
        };

        self.showConfirm(text, {}, handleAuth, data);

        function handleAuth(res) {
          window.location.reload();
        }
      });

      self.$btnDeleteList.on('click', function () {
        var $temp = $(this);
        var username = $temp.data('username');
        var text = '该操作不可恢复，确定删除该用户？';
        var data = {
          type: 'delete',
          username: username
        };

        self.showConfirm(text, data, handleDelete);

        function handleDelete(res) {
          window.location.reload();
        }
      });

      self.$btnResetList.on('click', function () {
        var $temp = $(this);
        var username = $temp.data('username');
        var text = '该用户的密码将被重置为00000000，确定重置？';
        var data = {
          type: 'reset',
          username: username,
          password: '00000000'
        };

        self.showConfirm(text, data, handleReset);

        function handleReset(res) {
          self.showError('重置成功');
        }
      });

      function listenKeyPress(e) {
        if (e.keyCode === 13) {
          self.$btnSearch.click();
          $(this).blur();
          e.preventDefault();
        }
      }

    },
    unBindEvent: function () {
      var self = this;
    },
    reBindEvent: function () {
      var self = this;

      self.buildElement();
      self.unBindEvent();
      self.bindEvent();

    },
    checkInput: function () {
      var self = this;
      var value = self.$inputSearch.val();
      var stamp = true;

      if ($.trim(value) === '') {
        stamp = false;
      }

      return stamp;
    },
    getInput: function () {
      var self = this;

      return $.trim(self.$inputSearch.val());
    },
    showError: function (text) {
      var self = this;

      easyDialog.open({
        container: {
          header: '提示',
          content: text,
          yesFn: function () {
          },
          noFn: false
        },
        drag: true,
        fixed: true
      });
    },
    showConfirm: function (str, obj, callback, auth) {

      easyDialog.open({
        container: {
          header: '提示',
          content: str,
          yesFn: function () {
            if (auth) {
              auth.role = parseInt($('#auth-content input:checked').val());
              obj = auth;
            }
            $.ajax({
              url: '/user/manage',
              type: 'post',
              contentType: 'application/JSON',
              data: JSON.stringify(obj),
              dataType: 'json',
              success: function (res) {
                callback && callback(res);
              }
            });
          },
          noFn: true
        },
        drag: true,
        fixed: true
      });
    },
    searchAjax: function (obj, callback) {
      $.ajax({
        url: '/user/manage',
        type: 'post',
        contentType: 'application/JSON',
        data: JSON.stringify(obj),
        dataType: 'json',
        success: function (res) {
          callback && callback(res);
        }
      });
    },
    renderList: function (obj) {
      var self = this;

      ejs.open = '{{';
      ejs.close = '}}';

      return ejs.render(self.tplList, obj);
    }
  };

  manageUser.init();

});