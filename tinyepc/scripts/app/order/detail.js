require(['ajax', 'moment', 'pikaday', 'jquery', 'amplify', 'header'], function(ajax, moment, Pikaday) {
	var orderDetail = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();

		},

		initEls: function() {
			var self = this;

			self.$orderWrapper = $('#order-wrapper');
		},

		initAttrs: function() {
			var self = this;

			self.orderId = self.$orderWrapper.attr('data-order-id');
		},

		initEvents: function() {
			var self = this;

			self.$orderWrapper.on('click', '[data-action="add"]', function() {
				self.buyGoods($(this));
			});
		},

		buyGoods: function($this) {
			var self = this,
				$item = $this.closest('.item'),
				partCode = $item.attr('data-code');

			amplify.publish('shoppingCartAdd', partCode);
			self.showAddInfo($item);
			self.hideAddInfo($item);
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

	orderDetail.init();
})