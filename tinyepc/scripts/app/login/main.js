require(['ajax', 'jqExtend', 'jquery'], function(ajax) {
	var login = {
		init: function() {
			var self = this;

			self.initEls();
			self.initEvents();
		},

		initEls: function() {
			var self = this;

			self.$loginForm = $('#login-form');
			self.$infoWrapper = $('.info-wrapper');
			self.$loginBtn = $('#login-btn');
			self.$verifyCodeWrapper = $('#verify-code-wrapper');
			self.$languangeBtn = $('.languange-btn');
		},

		initEvents: function() {
			var self = this;

			self.$loginBtn.on('click', function() {
				self.postLogin($(this));
			});
			self.$verifyCodeWrapper.on('click', '.verify-img', function() {
				self.refreshVerifyCode();
			});
			self.$loginForm.on('input', 'input', function() {
				if ($(this).val().length > 0) {
					$(this).closest('.data-item').removeClass('error');
				}
			});
			self.$loginForm.on('keyup', 'input', function(e) {
				if (e.which === 13) {
					self.postLogin();
				}
			});
			self.$languangeBtn.on('click', function() {
				self.changeLang($(this));
			});
		},

		validate: function() {
			var self = this,
				result = self.checkAllNull();

			if (result.success) {
				return true;
			} else {
				self.setErrorInfo(result.msg);
				return false;
			}
		},

		postLogin: function($this) {
			var self = this,
				$this = $this || self.$loginBtn,
				params;

			if ($this.hasClass('disabled')) {
				return;
			}
			if (!self.validate()) {
				return;
			}
			params = self.$loginForm.getFormValue();

			ajax.invoke({
				url: globalConfig.path + '/user/login',
				type: 'POST',
				data: params,
				beforeSend: function() {
					$this.addClass('disabled').find('.text').text(globalConfig.trans['t_008']);
				},
				success: function(data) {
					if (data.retcode == '0') {
						location.href = globalConfig.homePath;
						return;
					}
					if (data.retcode == 'UNKNOWN-ACCOUNT') {

					} else if (data.retcode == 'INCORRECT-CREDENTIALS') {

					}
					self.setErrorInfo(data.message);
					if (data.needVerifyCode) {
						self.$verifyCodeWrapper.removeClass('hide');
						self.refreshVerifyCode();
					}
				},
				failed: function() {
					// never happened
				},
				complete: function() {
					$this.removeClass('disabled').find('.text').text(globalConfig.trans['t_009']);
				}
			});
		},

		refreshVerifyCode: function() {
			var self = this;

			self.$verifyCodeWrapper.find('img').attr('src', globalConfig.path + '/user/login/captcha?' + new Date().getTime());
		},

		setErrorInfo: function(info) {
			var self = this;

			self.$infoWrapper.find('.text').text(info).end().css('visibility', 'visible');
		},

		hideErrorInfo: function() {
			var self = this;

			self.$infoWrapper.hide();
		},

		checkAllNull: function() {
			var self = this;
			var dataName = dataName || '[data-null=false]',
				needName = needName || '[data-need="false"]',
				result = {
					success: true,
					msg: ''
				},
				magArr = [];

			var needCheckInput = self.$loginForm.find('input, textarea, select').not(needName).not(':hidden').filter(dataName);

			needCheckInput.each(function(index, element) {
				var $element = $(element),
					val = $.trim($element.val()),
					msg = $element.attr('data-msg');


				if (!val || val.length === 0) {
					$element.closest('.data-item').addClass('error');
					magArr.push(msg);
					result.success = false;
				}

			});

			if (!result.success) {
				result.msg = globalConfig.trans['t_010'] + magArr.join('、');
			}

			return result;
		},

		changeLang: function($dom) {
			var self = this,
				lang = $dom.attr('data-lang-code');

			ajax.invoke({
				url: globalConfig.path + '/change-locale?locale=' + lang,
				success: function() {
					window.location.href = window.location.href;
				}
			});
		}
	}

	login.init();
})