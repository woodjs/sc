define(['jquery', 'ajax', 'codeMirror', 'codeMirrorMode', 'easyDialog', '!domReady'], function ($, ajax, CodeMirror, codeMirrorMode) {

  var addProject = {
    init: function () {
      var self = this;

      self.buildElement();
      self.bindEvent();
      self.initCodeMirror();
    },
    buildElement: function () {
      var self = this;

      self.$codeMirror1 = self.createCodeMirror($('#code1')[0]);
      self.$codeMirror2 = self.createCodeMirror($('#code2')[0]);
      self.$codeMirror3 = self.createCodeMirror($('#code3')[0]);
      self.$codeMirror4 = self.createCodeMirror($('#code4')[0]);
      self.$gulpfile = $('#gulpfile');
      self.$codeMirrorList = [self.$codeMirror1, self.$codeMirror2, self.$codeMirror3, self.$codeMirror4];
      self.$tabBtnList = $('#tab-btn-list .btn');
      self.$createdProjectList = $('#box-project-show span');
      self.$inputProjectName = $('#input-project-name');
      self.$btnAdd = $('#btn-add');
      self.$btnSubmit = $('#btn-submit');
      self.$curProjectName = $('#cur-project-name');

    },
    bindEvent: function () {
      var self = this;

      self.$inputProjectName.on('keypress', listenKeyPress);

      self.$tabBtnList.on('click', function () {
        var $temp = $(this);
        var href = $temp.data('href');
        $temp.addClass('active').siblings().removeClass('active');
        $('#' + href).show().find('.CodeMirror').show().end().siblings().hide().find('.CodeMirror').hide();
      });

      self.$btnAdd.on('click', function () {
        var projectName = self.$inputProjectName.val();

        if ($.trim(projectName) === '') {
          self.showError('请输入要添加的项目名!');
          return;
        }
        if (self.isProjectCreated()) {
          self.showError('该项目名已被占用,请重新输入!');
          return;
        }
        self.$curProjectName.html(projectName);
        self.$inputProjectName.val('');
      });

      self.$btnSubmit.on('click', function () {
        if (self.checkAllInput()) {
          var data = self.getAllInput();
          ajax.invoke({
            url: '/project/add',
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

      $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
        }
      });
      
      function listenKeyPress(e) {
        if (e.keyCode === 13) {
          self.$btnAdd.click();
          $(this).blur();
          e.preventDefault();
        }
      }

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
    isProjectCreated: function () {
      var self = this;
      var projectName = $.trim(self.$inputProjectName.val());
      var stamp = false;

      self.$createdProjectList.each(function (index, object, arr) {
        var $temp = $(object);

        if ($temp.data('project-name') === projectName) {
          stamp = true;
        }
      });

      return stamp;
    },
    checkAllInput: function () {
      var self = this;
      var stamp = true;

      if ($.trim(self.$curProjectName.html()) === '') {
        self.showError('请添加项目名称!');
        return false;
      }

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

      if (self.isProjectCreated()) {
        self.showError('该项目名已被占用,请重新输入!');
        return false;
      }

      return true;

    },
    getAllInput: function () {
      var self = this;
      var temp = {};

      temp.projectName = $.trim(self.$curProjectName.html());
      temp.gulpfile = self.$gulpfile.html();
      temp.scriptsConfig = self.$codeMirror1.getValue();
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

  addProject.init();

});