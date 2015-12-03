define(['jquery', 'ajax', 'easyDialog', 'ejs', '!domReady'], function ($, ajax) {

  var optimize = {
    init: function () {
      var self = this;

      self.buildElement();
      self.buildlTpl();
      self.bindEvent();
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
    },
    buildlTpl: function () {
      var self = this;

      self.tplList = $('#tpl-project-list').html();
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

        $temp.hide().siblings('.btn').show();
        $temp.closest('tr').addClass('warn').siblings('tr').addClass('disable');

        self.showConfirm(text, data, handleAction);

        function handleAction(res) {
          //window.location.reload();
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
    showConfirm: function (str, obj, callback) {

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
    }
  };

  optimize.init();

});