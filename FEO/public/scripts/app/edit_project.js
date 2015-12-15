define(['jquery', 'ajax', 'codeMirror', 'codeMirrorMode', 'easyDialog', '!domReady'], function ($, ajax, CodeMirror, codeMirrorMode) {

  var editProject = {
    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
      self.initCodeMirror();
      self.projectName = $.trim(self.$curProjectName.html());
    },
    buildElement: function () {
      var self = this;

      self.$codeMirror1 = self.createCodeMirror($('#code1')[0]);
      self.$codeMirror2 = self.createCodeMirror($('#code2')[0]);
      self.$codeMirror3 = self.createCodeMirror($('#code3')[0]);
      self.$codeMirror4 = self.createCodeMirror($('#code4')[0]);
      self.$codeMirrorList = [self.$codeMirror1, self.$codeMirror2, self.$codeMirror3, self.$codeMirror4];
      self.$tabBtnList = $('#tab-btn-list .btn');
      self.$btnSubmit = $('#btn-submit');
      self.$curProjectName = $('#cur-project-name');
    },
    bindEvent: function () {
      var self = this;

      self.$tabBtnList.on('click', function () {
        var $temp = $(this);
        var href = $temp.data('href');
        $temp.addClass('active').siblings().removeClass('active');
        $('#' + href).show().find('.CodeMirror').show().end().siblings().hide().find('.CodeMirror').hide();
      });

      self.$btnSubmit.on('click', function () {
        if (self.checkAllInput()) {
          var data = self.getAllInput();

          ajax.invoke({
            url: '/project/edit/' + self.projectName,
            type: 'post',
            contentType: 'application/JSON',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {
              if (res.status === 200) {
                window.location.href = '/project/manage';
              }
            }
          });
        }
      });

      self.interId = setInterval(function () {
        var data = {
          type: 'session_expired'
        };

        ajax.invoke({
          url: '/check',
          type: 'post',
          contentType: 'application/JSON',
          data: JSON.stringify(data),
          dataType: 'json',
          success: function (res) {
            if (res.result) {
              self.showError('当前会话已过期，请注意备份相关数据！');
              clearInterval(self.interId);
            }
          }
        });

      }, 1000 * 3605);
    },
    initCodeMirror: function () {
      var self = this;

      self.$codeMirrorList.forEach(function (obj, index, arr) {
        obj.setSize('100%', '100%');
      });

    },
    createCodeMirror: function (textarea) {
      return CodeMirror.fromTextArea(textarea, {
        value: textarea.value,
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'rubyblue',
        indentUnit: 2,
        smartIndent: true,
        tabSize: 2
      });
    },
    checkAllInput: function () {
      var self = this;
      var stamp = true;

      self.$codeMirrorList.forEach(function (obj, index, arr) {
        var value = obj.getValue();
        if ($.trim(value) === '') {
          stamp = false;
        }
      });

      if (!stamp) {
        self.showError('尚有配置文件未填写,请检查各项!');
        return false;
      }

      return true;

    },
    getAllInput: function () {
      var self = this;
      var temp = {};

      temp.projectName = self.projectName;
      temp.gulpfile = self.$codeMirror1.getValue();
      temp.cssConfig = self.$codeMirror2.getValue();
      temp.requireConfig = self.$codeMirror3.getValue();
      temp.srcConfig = self.$codeMirror4.getValue();

      return temp;
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
    }
  };

  editProject.init();

});