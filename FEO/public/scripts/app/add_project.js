define(['jquery', 'codeMirror', 'codeMirrorMode', '!domReady'], function ($, CodeMirror, codeMirrorMode) {

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
      self.$tabBtnList = $('#tab-btn-list .btn');
    },
    bindEvent: function () {
      var self = this;

      self.$tabBtnList.on('click', function () {
        var $temp = $(this);
        var href = $temp.data('href');
        $temp.addClass('active').siblings().removeClass('active');
        $('#' + href).show().find('.CodeMirror').show().end().siblings().hide().find('.CodeMirror').hide();
      });

    },
    initCodeMirror: function () {
      var self = this;

      self.$codeMirror1.setSize('100%', '100%');
      self.$codeMirror2.setSize('100%', '100%');
      self.$codeMirror3.setSize('100%', '100%');
      self.$codeMirror4.setSize('100%', '100%');

      self.$codeMirror1.setValue('GulpFile');
      self.$codeMirror2.setValue('cssConfig');
      self.$codeMirror3.setValue('requireConfig');
      self.$codeMirror4.setValue('bat');
    },
    createCodeMirror: function (textarea) {
      return CodeMirror.fromTextArea(textarea, {
        value: textarea.value,
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'rubyblue',
        indentUnit : 2,
        smartIndent: true,
        tabSize: 2
      });
    }
  };

  addProject.init();

});