define(['jquery', 'ajax', 'socketIO', 'easyDialog', 'ejs', '!domReady'], function ($, ajax, io) {

  var optimize = {
    init: function () {
      var self = this;

      self.buildElement();
      self.buildlTpl();
      self.bindEvent();
      self.bindSocket();
      self.isSocketConnected = null;
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
      self.$btnClear = $('#btn-clear');
      self.$btnOpen = $('#btn-open');
      self.$btnClose = $('#btn-close');
      self.$infoStage = $('#info-stage');
      self.$blockRightStage = $('#block-right-stage');
      self.$container = $('html, body');
      self.$document = $(document);
      self.$curCancelBtn = null;
      window.$curCancelBtn = null;
    },
    buildlTpl: function () {
      var self = this;

      self.tplList = $('#tpl-project-list').html();
    },
    bindSocket: function () {
      var self = this;

      self.socket = io.connect(socketServerUrl);
      self.socket.on('connect', function () {
        self.isSocketConnected = true;
      });
      self.socket.on('connect_error', function (err) {
        if (err) {
          self.socket.close();
          self.isSocketConnected = false;
          self.showError('socket服务未连接成功，请检查配置或网络！');
        }
      });
      self.socket.on('optimize message', function (data) {
        self.$infoStage.append(data);
        self.$container.animate({
          scrollTop: self.$document.height()
        }, 0);
      });
      self.socket.on('optimize stop', function () {
        self.stampNotOptimizing();
        self.unlockBtns(self.$curCancelBtn);
      });

    },
    bindEvent: function () {
      var self = this;

      $(window).on('beforeunload', self.stampNotOptimizing);

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
        var text = '确定优化'+ projectName +'项目？';
        var data = {
          type: 'action',
          projectName: projectName
        };

        if (self.isSocketConnected) {
          self.showConfirm(text, data, $temp, handleAction);
        } else {
          self.showError('socket服务未连接成功，请检查配置或网络！');
        }

        function handleAction(res) {
          if (res.status === 200) {
            self.clearInfoStage();
            self.lockBtns($temp);
            self.socket.emit('start optimize', data.projectName);
            $temp.closest('td').prev().html(res.optimizeBy).prev().html(res.optimizeTime);
          } else if (res.status === 201) {
            self.showError('有其它用户正在操作'+ projectName +'项目，请稍后！');
          }
        }
      });

      self.$bgLoading.on('click', function (e) {
        e.stopPropagation();
      });

      self.$btnClear.on('click', function () {
        self.clearInfoStage();
      });

      self.$btnOpen.on('click', function () {
        self.$blockRightStage.css({
          width: '1100px'
        });
        $(this).hide();
        self.$btnClose.show();
      });

      self.$btnClose.on('click', function () {
        self.$blockRightStage.css({
          width: '648px'
        });
        $(this).hide();
        self.$btnOpen.show();
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
    lockBtns: function ($obj) {
      var self = this;

      $obj.hide().siblings('.btn').show();
      $obj.closest('tr').addClass('warn').siblings('tr').addClass('disable');
      self.unBindEvent();
      self.$curCancelBtn = $obj.siblings('.btn');
      window.$curCancelBtn = $obj.siblings('.btn');
      self.$curCancelBtn.on('click', function () {
        var $temp = $(this);
        var projectName = $temp.data('project-name');
        var text = '确定取消优化'+ projectName +'项目？';
        var data = {
          type: 'cancel',
          projectName: projectName
        };

        if (self.isSocketConnected) {
          self.showConfirm(text, data, $temp, handleCancel);
        } else {
          self.showError('socket服务未连接成功，请检查配置或网络！');
        }

        function handleCancel(res) {
          if (res.status === 200) {
            self.socket.emit('stop optimize', data.projectName);
            self.unlockBtns($temp);
          } else if (res.status === 201) {
            self.show('该项目尚无人操作！');
            self.unlockBtns($temp);
          }
        }
      });
    },
    unlockBtns: function ($obj) {
      var self = this;

      window.$curCancelBtn = null;
      $obj.hide().siblings('.btn').show();
      $obj.closest('tr').removeClass('warn').siblings('tr').removeClass('disable');
      self.bindEvent();
    },
    clearInfoStage: function () {
      var self = this;

      self.$infoStage.html('');
    },
    stampNotOptimizing: function () {

      if (window.$curCancelBtn) {
        var projectName = window.$curCancelBtn.data('project-name');
        var data = {
          type: 'cancel',
          projectName: projectName
        };
        ajax.invoke({
          url: '/optimize',
          type: 'post',
          contentType: 'application/JSON',
          async: false,
          data: JSON.stringify(data),
          dataType: 'json',
          success: function (res) {
            console.log(res);
          }
        });
      }
    }
  };

  optimize.init();

});
