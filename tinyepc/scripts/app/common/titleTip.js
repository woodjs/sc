define(['ajax', 'jquery'], function(ajax) {
	var titleTip = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();
		},

		initEls: function() {
			var self = this;

			self.$noramlTip = $('.float-tip-block.normal');
			self.$priceTip = $('.float-tip-block.price');
		},

		initAttrs: function() {
			var self = this;

			self.distance = 10;
			self.timer = null;
			self.showTimer = null;
		},

		initEvents: function() {
			var self = this;

			$(document).on('mouseenter', '[data-title]', function() {
				var $target = $(this);
				clearTimeout(self.showTimer);
				self.timer = setTimeout(function() {
					self.showTip($target, true);
				}, 500);
			});
			$(document).on('mouseleave', '[data-title]', function() {
				var $target = $(this);
				clearTimeout(self.timer);
				self.showTimer = setTimeout(function() {
					self.hideTip($target, true);
				}, 500);

			});
			$(document).on('mouseenter', '[data-price]', function() {
				clearTimeout(self.priceShowTimer);
				self.getPrice($(this));
			});
			$(document).on('mouseleave', '[data-price]', function() {
				var $target = $(this);
				self.priceShowTimer = setTimeout(function() {
					self.hideTip($target, false);
				}, 500);

			});
			$(document).on('mouseenter', '.float-tip.noraml', function() {
				clearTimeout(self.showTimer);
			});
			$(document).on('mouseleave', '.float-tip.noraml', function() {
				var $target = $(this);
				self.showTimer = setTimeout(function() {
					$target.hide();
				}, 500);
			});
			$(document).on('mouseenter', '.float-tip.price', function() {
				clearTimeout(self.priceShowTimer);
			});
			$(document).on('mouseleave', '.float-tip.price', function() {
				var $target = $(this);
				self.priceShowTimer = setTimeout(function() {
					$target.hide();
				}, 500);
			});
		},

		setTipPosition: function($dom, $target, isVertical, title) {
			var self = this,
				offPosition = $target.offset(),
				topHeight = offPosition.top - $(window).scrollTop(),
				bottomHeight = $(window).height() - topHeight,
				leftWidth = offPosition.left - $(window).scrollLeft(),
				rightWidth = $(window).width() - leftWidth,
				title = title || $target.attr('data-title'),
				targetH = $target.outerHeight(),
				targetW = $target.outerWidth(),
				direction = $target.attr('data-direction'),
				tipWidth, tipHeight,
				tipTop, tipLeft;

			$dom.find('.text').text(title);
			tipWidth = $dom.outerWidth();
			tipHeight = $dom.outerHeight();

			if (isVertical) {

				if ((topHeight > bottomHeight) || direction == "bottom") {
					$dom.removeClass('top bottom').addClass('bottom');
					tipTop = topHeight - tipHeight - self.distance;
				} else {
					$dom.removeClass('top bottom').addClass('top');
					tipTop = topHeight + targetH + self.distance;
				}

				tipLeft = leftWidth - tipWidth / 2 + targetW / 2;

			} else {
				if ((leftWidth < rightWidth) || direction == "left") {
					$dom.removeClass('left right').addClass('left');
					tipLeft = leftWidth + targetW + 10;
				} else {
					$dom.removeClass('left right').addClass('right');
					tipLeft = leftWidth - tipWidth - 10;
				}

				tipTop = topHeight + (targetH - tipHeight) / 2;
			}
			$dom.css({
				top: tipTop,
				left: tipLeft
			});
		},

		showTip: function($target, isVertical, title) {
			var self = this,
				$dom = isVertical ? self.$noramlTip : self.$priceTip;

			self.setTipPosition($dom, $target, isVertical, title);
			$dom.show();
		},

		hideTip: function($target, isVertical) {
			var self = this,
				$dom = isVertical ? self.$noramlTip : self.$priceTip;

			$dom.hide();
		},
		getPrice: function($dom) {
			var self = this,
				$partItem = $dom.closest('.parts-item'),
				partId = $partItem.attr('data-part-id') || $partItem.attr('data-id');

			if (self.xhr) {
				self.xhr.abort();
			}
			self.xhr = ajax.invoke({
				url: globalConfig.path + '/part/' + partId + '/formatted-price',
				success: function(result) {
					self.showTip($dom, false, result.result);
				}
			})
		}
	};

	titleTip.init();
	return titleTip;
});