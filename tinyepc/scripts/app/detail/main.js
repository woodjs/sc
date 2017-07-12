require(['ajax', 'picpreview', 'util', 'amplify', 'hashchange', 'jquery', 'header'], function(ajax, PicPreview, util) {
	var detail = {
		init: function() {
			var self = this;

			self.initEls();
			self.initEvents();
			self.initComponent();
			self.setFirstSelected();
		},

		initEls: function() {
			var self = this;

			self.$partRelativeContainer = $('.part-relative-content');
			self.supersessionContent = $('#supersession-tab-content');
			self.applicableContent = $('#applicability-tab-content');
			self.$tabBtn = $('.tab-btn');

			self.$buyBtn = $('#buy-goods');
			self.$cartAddInfo = $('.cart-add-info');
		},

		initEvents: function() {
			var self = this;

			self.$tabBtn.on('click', function() {
				self.toggleTabContent($(this));
			});
			$(window).hashchange(function() {
				self.setFirstSelected();
			});
			self.$buyBtn.on('click', function() {
				var partCode = $(this).closest('.part-content').attr('data-code');
				amplify.publish('shoppingCartAdd', partCode, function() {
					self.showAddInfo();
					self.hideAddInfo();
				});
			});

		},

		initComponent: function() {
			var self = this;
			var picPreview = new PicPreview();

			self.getSupersession();
			self.getApplicableInfo();
		},

		toggleTabContent: function($tab) {
			var self = this,
				index = $tab.index();

			$tab.addClass('active').siblings().removeClass('active');
			$('.tab-content').eq(index).addClass('active').siblings().removeClass('active');
			self.setHash($tab.attr('data-hashname'));
		},

		setFirstSelected: function() {
			var self = this;

			if (!self.$tabBtn.length) {
				return;
			}

			var hash = util.getHash(),
				targetName = hash.target;

			if (targetName) {
				var targetItem = self.getTabFormHash(targetName);
				if (targetItem) {
					return self.toggleTabContent(targetItem);
				}
			}
			self.toggleTabContent(self.$tabBtn.eq(0));

		},

		getTabFormHash: function(name) {
			var self = this,
				result;

			self.$tabBtn.each(function(index, item) {
				var $item = $(item);
				if ($item.attr('data-hashname') == name) {
					result = $item;
					return false;
				}
			});

			return result;
		},

		getSupersession: function() {
			var self = this;

			if (!pageContext.hasSupersession) {
				return;
			}
			ajax.invoke({
				url: globalConfig.path + '/part/' + pageContext.partId + '/supersessions',
				dataType: 'html',
				success: function(html) {
					self.supersessionContent.html(html);
				}
			})
		},

		getApplicableInfo: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/part/' + pageContext.partId + '/applies',
				dataType: 'html',
				success: function(html) {
					self.applicableContent.html(html);
				}
			});
		},

		setHash: function(name) {
			var self = this;

			window.location.hash = $.param({
				target: name
			});
		},

		showAddInfo: function(type, text) {
			var self = this,
				type = type || 'ok',
				text = text || globalConfig.trans['t_005'];

			self.$cartAddInfo.removeClass('info error warn').addClass(type).find('.text').text(text).end().css('opacity', 1).addClass('show');

		},

		hideAddInfo: function() {
			var self = this;

			setTimeout(function() {
				self.$cartAddInfo.animate({
					opacity: 0
				}, 500);
			}, 1000);
		}
	};

	detail.init();
})