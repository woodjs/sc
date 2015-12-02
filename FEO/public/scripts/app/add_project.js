define(['jquery', 'codeMirror', 'codeMirrorMode', 'easyDialog', '!domReady'], function ($, CodeMirror, codeMirrorMode) {

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
      self.$codeMirror5 = self.createCodeMirror($('#code5')[0]);
      self.$codeMirrorList = [self.$codeMirror1, self.$codeMirror2, self.$codeMirror3, self.$codeMirror4, self.$codeMirror5];
      self.$tabBtnList = $('#tab-btn-list .btn');
      self.$createdProjectList = $('#box-project-show span');
      self.$inputProjectName = $('#input-project-name');
      self.$btnAdd = $('#btn-add');
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

      /*self.$codeMirror1.setValue('gulpfile');
      self.$codeMirror2.setValue('cssConfig');
      self.$codeMirror3.setValue('requireConfig');
      self.$codeMirror4.setValue('bat');
      self.$codeMirror5.setValue('srcConfig');*/
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