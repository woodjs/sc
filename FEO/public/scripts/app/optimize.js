define(['jquery', 'ajax', 'socketIO', 'easyDialog', 'ejs', '!domReady'], function ($, ajax, io) {

  var optimize = {
    init: function () {
      var self = this;

      self.buildElement();
      self.buildlTpl();
      self.bindEvent();
      self.bindSocket();
    },
    buildElement: function () {
      var self = this;

      self.$inputSearch = $('#input-search');
      self.$btnSearch = $('#btn-search');
      self.$btnShowAll = $('#btn-show-all');
      self.$btnActionList = $('.btn-action');
      self.$tbodyProjectList = $('#tbody-project-list');
      self.$bgLoading = $('#bg-loading');
      self.$holdLoading = $('#hold-loading');
      self.$btnCancel = $('#btn-cancel');
      self.$infoStage = $('#info-stage');
    },
    buildlTpl: function () {
      var self = this;

      self.tplList = $('#tpl-project-list').html();
    },
    bindSocket: function () {
      var self = this;
      self.socket = io.connect('http://localhost:3000');
      self.socket.on('optimize message', function (data) {
        self.$infoStage.append(data);
      });
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
            self.$tbodyProjectList.html(self.renderList(res));
            self.reBindEvent();
          });
        } else {
          self.showError('请输入项目名称!');
        }
      });

      self.$btnShowAll.on('click', function () {
        var data = {
          type: 'all',
          search: self.getInput()
        };
        self.searchAjax(data, function (res) {
          self.$tbodyProjectList.html(self.renderList(res));
          self.reBindEvent();
        });
      });

      self.$btnActionList.on('click', function () {
        var $temp = $(this);
        var projectName = $temp.data('project-name');
        var text = '确定优化该项目？';
        var data = {
          type: 'action',
          projectName: projectName
        };

        self.showConfirm(text, data, $temp, handleAction);

        function handleAction(res) {
          if (res.status === 200) {
            $temp.closest('td').prev().html(res.optimizeBy).prev().html(res.optimizeTime);
            self.unlockBtns($temp.siblings('.btn'));
          }
        }

      });

      self.$bgLoading.on('click', function (e) {
        e.stopPropagation();
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

      self.$inputSearch.off('keypress');
      self.$btnSearch.off('click');
      self.$btnShowAll.off('click');
      self.$btnActionList.off('click');
      self.$bgLoading.off('click');
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
    showConfirm: function (str, obj, $btn, callback) {
      var self = this;

      easyDialog.open({
        container: {
          header: '提示',
          content: str,
          yesFn: function () {
            self.controlOptimize($btn);
            ajax.invoke({
              url: '/optimize',
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
      ajax.invoke({
        url: '/project/manage',
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
    },
    controlOptimize: function ($obj) {
      var self = this;

      if ($obj.is('.btn-action')) {
        self.lockBtns($obj);
      } else {
        self.unlockBtns($obj);
      }
    },
    lockBtns: function ($obj) {
      var self = this;

      $obj.hide().siblings('.btn').show();
      $obj.closest('tr').addClass('warn').siblings('tr').addClass('disable');
      self.unBindEvent();
      $obj.siblings('.btn').on('click', function () {
        var $temp = $(this);
        var projectName = $temp.data('project-name');
        var text = '确定取消优化该项目？';
        var data = {
          type: 'cancel',
          projectName: projectName
        };
        self.showConfirm(text, data, $temp, handleCancel);

        function handleCancel(res) {
          if (res.status === 200) {
            self.unlockBtns($temp.siblings('.btn'));
          }
        }
      });
    },
    unlockBtns: function ($obj) {
      var self = this;

      $obj.hide().siblings('.btn').show();
      $obj.closest('tr').removeClass('warn').siblings('tr').removeClass('disable');
      self.bindEvent();
    }
  };

  optimize.init();

});