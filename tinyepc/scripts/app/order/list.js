require(['ajax', 'dialog', 'moment', 'pikaday', 'dialog', 'util', 'jqExtend', 'jquery', 'header'], function(ajax, Dialog, moment, Pikaday, Dialog, util) {
	var orderList = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();
			self.initComponent();
		},

		initEls: function() {
			var self = this;

			self.$searchForm = $('#search-form');
			self.$searchBtn = $('#search-btn');
			self.$resetBtn = $('#reset-btn');

			self.$orderListWrapper = $('#order-list-wrapper');
		},

		initAttrs: function() {
			var self = this;

			if (globalConfig.lang === 'zh') {
				self.i18n = {
					previousMonth: '上月',
					nextMonth: '下月',
					months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
					weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
					weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
				};
			} else {
				self.i18n = {
					previousMonth: 'Previous Month',
					nextMonth: 'Next Month',
					months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
				};
			}
		},

		initEvents: function() {
			var self = this;

			self.$searchBtn.on('click', function() {
				self.searchForm();
			});
			self.$resetBtn.on('click', function() {
				self.resetForm();
			});
			self.$orderListWrapper.on('click', '[data-action="delete"]', function() {
				self.deletOrder($(this));
			});
		},

		initComponent: function() {
			var self = this;

			self.createCalendar();
		},

		createCalendar: function() {
			var self = this;

			self.startDate = new Pikaday({
				field: $('#search-date-start-input')[0],
				i18n: self.i18n
			});
			self.endDate = new Pikaday({
				field: $('#search-date-end-input')[0],
				i18n: self.i18n
			});
		},

		searchForm: function() {
			var self = this,
				pValue = util.getUrlParams('p'),
				params;

			params = $.extend(true, {}, {
				p: pValue
			}, self.$searchForm.getFormValue() || {});

			window.location.href = window.location.href.split('?')[0] + '?' + $.param(params);

		},

		resetForm: function() {
			var self = this;

			window.location.href = window.location.href.split('?')[0];
		},

		deletOrder: function($this) {
			var self = this,
				currentItem = $this.closest('.item'),
				orderId = currentItem.attr('data-code');

			new Dialog({
				content: globalConfig.trans['t_011'],
				onConfirm: function() {
					ajax.invoke({
						url: globalConfig.path + '/v-order/' + orderId + '/delete',
						type: 'POST',
						success: function() {
							location.href = pageContext.keepParamsUrl;
						}
					})
				}
			});

		}
	};

	orderList.init();
})