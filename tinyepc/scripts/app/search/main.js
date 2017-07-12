require(['ajax', 'titleTip', 'jquery', 'jqExtend', 'lazyload', 'pjax', 'header', 'amplify'], function(ajax) {

	var path = globalConfig.path;

	var search = {
		init: function() {
			var self = this;

			self.lazyload();

			self.initEls();
			self.initTempl();
			self.initEvents();
			self.initComponents();
		},

		initEls: function() {
			var self = this;

			self.$conditionWrapper = $('.search-condition');
			self.$contionItemWrapper = self.$conditionWrapper.find('.condition-item-wrapper');
			self.$conditionBtn = self.$conditionWrapper.find('.condition-btn');
			self.$searchResultWrapper = $('#search-block');
			self.$operationWrapper = $('.part-operate-wrapper');
		},

		initTempl: function() {
			var self = this;

			self.loadingTempl = '<div class="loading-box"><span class="icon loading-small"></span><span class="text">' + globalConfig.trans['t_012'] + '</span></div>';
		},

		initEvents: function() {
			var self = this;

			self.$conditionBtn.click(function() {
				self.setConditonItemStatus($(this));
			});
			self.$searchResultWrapper.on('click', '[data-action="buy"]', function() {
				var $item = $(this).closest('.search-result-item');
				var partCode = $item.attr('data-code');
				amplify.publish('shoppingCartAdd', partCode, function(result) {
					self.showAddInfo($item);
					self.hideAddInfo($item);
				});
			});
			$(document).on('click', '#search-btn', function() {
				self.searchInResult($(this));
			});
			$(document).on('keyup', 'input[name="exp_q"]', function(e) {
				if (e.which === 13) {
					self.searchInResult($(this));
				}
			});
			$(document).on('click', '#search-page-btn', function() {
				self.searchByPage($(this));
			});
			$(document).on('keyup', 'input[name="p"]', function(e) {
				if (e.which === 13) {
					self.searchByPage($(this));
				}
			});
			$(document).pjax('.change-page', '.search-result');
			$(document).on('pjax:beforeSend', function() {
				self.$searchResultWrapper.prepend(self.loadingTempl);
				// TODO
				$(document).scrollTop(0);
			});
			$(document).on('pjax:success', function() {
				self.lazyload();
				$('.search-box-wrapper').initPlaceHolder();
			});
			$(window).on('resize', function() {
				self.setConditionHeight();
			});
		},

		initComponents: function() {
			var self = this;

			self.setConditionHeight();
			$('.search-box-wrapper').initPlaceHolder();
		},

		lazyload: function() {
			$('.lazy').error(function() {
				this.src = globalConfig.path + "/images/no_image.jpg";
			}).lazyload({
				effect: "fadeIn",
				no_fake_img_loader: true
			});
		},

		setConditionHeight: function() {
			var self = this;

			self.$contionItemWrapper.height($(window).height() - $('.header').outerHeight() - $('.headline').outerHeight() - $('.footer').outerHeight() - 20)
		},

		setConditonItemStatus: function($item) {
			var self = this,
				$operateItem = $item.closest('.condition-item');

			if ($operateItem.hasClass('collapse')) {

				return $operateItem.removeClass('collapse').addClass('expand');
			}
			if ($operateItem.hasClass('expand')) {

				return $operateItem.removeClass('expand').addClass('collapse');
			}
		},

		searchInResult: function($this) {
			var self = this,
				searchParam = $.trim($('input[name="exp_q"]').val()),
				keepParamsUrl = $this.parent().data('url'),
				url = keepParamsUrl.indexOf('?') === -1 ? (keepParamsUrl + '?') : (keepParamsUrl + '&');

			window.location.href = url + 'exp_q=' + encodeURIComponent(searchParam);
		},

		searchByPage: function($this) {
			var self = this,
				page = $.trim($('input[name="p"]').val()),
				keepParamsUrl = $this.parent().data('url'),
				url = keepParamsUrl.indexOf('?') === -1 ? (keepParamsUrl + '?') : (keepParamsUrl + '&');

			if (!page) {
				return;
			}
			var targetUrl = url + 'p=' + encodeURIComponent(page);
			if ($.support.pjax) {
				$.pjax({
					url: targetUrl,
					container: $('.search-result')
				});
			} else {
				location.href = targetUrl;
			}
		},

		showAddInfo: function($item, type, text) {
			var self = this,
				type = type || 'ok',
				text = text || globalConfig.trans['t_005'];

			$item.find('.cart-add-info').removeClass('info error warn').addClass(type).find('.text').text(text).end().css('opacity', 1).addClass('show');

		},

		hideAddInfo: function($item) {
			var self = this;

			setTimeout(function() {
				$item.find('.cart-add-info').animate({
					opacity: 0
				}, 500);
			}, 1000);
		}
	};

	search.init();
})