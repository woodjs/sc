define(['ajax', 'util', 'titleTip', 'jquery', 'loading', 'amplify', 'scrollIntoView'], function(ajax, util) {

	var defaultOpts = {
		onRowClick: function() {}
	};

	var Parts = function(opts) {
		this.opts = $.extend(true, {}, defaultOpts, opts || {});

		this.init();
	};

	Parts.prototype = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();
			self.calculateScrollWidth();
		},

		initEls: function() {
			var self = this;

			self.partsWrapper = $('#parts-container');
		},

		initAttrs: function() {
			var self = this;

			self.lockScroll = true;
			self.floatScroll = true;
			self.isScroll = false;
			self.scrollWidth = 0;
			self.floatColumnWidth = 150;
		},

		initEvents: function() {
			var self = this;

			self.partsWrapper.on('click', '.parts-item', function() {
				var partId = $(this).attr('data-part-id');
				var callout = $(this).attr('data-callout');

				if (callout) {
					self.calloutHighlightRow(callout);
				} else {
					self.partIdHighlihtRow(partId);
				}

				self.opts.onRowSelection(callout, partId);
			});
		},

		calculateScrollWidth: function() {
			var self = this;
			var templ = '<div id="scroll-cal-parent" style="height:60px;overflow-x:scroll"><div id="scroll-cal-child" style="height: 90px;"></div></div>';

			$('body').append(templ);

			self.scrollWidth = $('#scroll-cal-parent').width() - $('#scroll-cal-child').width();
			$('#scroll-cal-parent').remove();
		},

		initScrollEls: function() {
			var self = this;

			self.$floatTable = $('#parts-float-table');
			self.$floatTbody = $('#parts-float-tbody');
			self.$lockTbody = $('#parts-lock-stbody');
			self.$lockWrapper = $('.parts-scroll-wrapper');
			self.$floatTbHeadWrapper = $('#parts-float-thead');
			self.$partItems = $('.parts-table-tbody .parts-item');

			self.$floatTbHead = $('.float-table-head');
			self.$floatTbBody = $('.float-table-body');

			self.$floatColumns = self.$floatTbHead.find('.column');
		},

		initScrollEvents: function() {
			var self = this;

			self.$lockTbody.hover(function(e) {
				self.disableLockScroll();
			}, function(e) {
				self.disableFloatScroll();
			});
			self.$lockTbody.on('click', '[data-action="buy"]', function() {
				var $item = $(this).closest('.parts-item');
				var partCode = $item.attr('data-code');
				amplify.publish('shoppingCartAdd', partCode, function() {
					self.showAddInfo($item);
					self.hideAddInfo($item);
				});
			});
			self.$floatTbody.hover(function(e) {
				self.disableFloatScroll();
			}, function(e) {
				self.disableLockScroll();
			});
			self.$floatTbody.on('scroll', function(e) {
				self.onScrollFloatParts(e);
			});
			self.$lockTbody.on('scroll', function(e) {
				self.onScrollLockParts(e);
			});
			self.$partItems.hover(function(e) {
				self.onEnterPartItems($(this));
			}, function(e) {
				self.onLeavePartItems($(this));
			});
			$(window).resize(function() {
				self.setPartTableWidth();
			});
		},

		setPartTableWidth: function() {
			var self = this,
				floatWidth = self.$floatColumns.length * self.floatColumnWidth,
				floatTbWidth = self.$floatTable.width(),
				columnAllWidth;

			if (floatWidth > floatTbWidth) {
				self.$lockWrapper.css('paddingBottom', self.scrollWidth);
			}
			if (self.$lockWrapper.outerHeight() > self.$lockTbody.outerHeight()) {
				self.$lockTbody.css('right', -1 * self.scrollWidth);
				floatTbWidth -= self.scrollWidth
			}
			columnAllWidth = floatWidth > floatTbWidth ? floatWidth : floatTbWidth;

			self.$floatTbHead.width(columnAllWidth);
			self.$floatTbBody.width(columnAllWidth);
		},

		disableFloatScroll: function(e) {
			var self = this;

			self.lockScroll = true;
			self.floatScroll = false;
		},

		disableLockScroll: function() {
			var self = this;

			self.lockScroll = false;
			self.floatScroll = true;
		},

		onEnterPartItems: function($dom) {
			var self = this,
				$target = $dom,
				index = $dom.index();

			if (self.isScroll || $target.hasClass('active')) {
				return;
			}
			$target.addClass('hover').closest('.parts-table-wrapper').siblings('.parts-table-wrapper').find('.parts-table-tbody .parts-item').eq(index).addClass('hover');
		},

		onLeavePartItems: function($dom) {
			var self = this,
				$target = $dom,
				index = $target.index();

			$target.removeClass('hover').closest('.parts-table-wrapper').siblings('.parts-table-wrapper').find('.parts-table-tbody .parts-item').eq(index).removeClass('hover');
		},

		onScrollFloatParts: function(e) {
			var self = this,
				$target = $(e.target),
				moveY = $target.scrollTop(),
				moveX = $target.scrollLeft();

			self.isScroll = true;

			self.$floatTbHeadWrapper.scrollLeft(moveX);
			if (self.lockScroll) {
				self.$lockTbody.scrollTop(moveY);
			}

			self.isScroll = false;
		},

		onScrollLockParts: function(e) {
			var self = this,
				$target = $(e.target),
				moveY = $target.scrollTop();

			self.isScroll = true;

			if (self.floatScroll) {
				self.$floatTbody.scrollTop(moveY);
			}

			self.isScroll = false;
		},

		load: function(params) {
			var self = this,
				url = globalConfig.path + '/usage/parts';

			if (self.xhr) {
				self.xhr.abort();
			}

			self.xhr = ajax.invoke({
				type: "GET",
				url: url,
				dataType: 'html',
				data: params,
				beforeSend: function() {
					self.partsWrapper.showLoading();
				},
				success: function(html) {
					self.partsWrapper.html(html);
					self.initParts();
					self.activeRow();
				},
				complete: function() {
					self.xhr = null;
					self.partsWrapper.hideLoading();
				}
			});
		},

		initParts: function() {
			var self = this;

			self.initScrollEls();
			self.initScrollEvents();
			self.setPartTableWidth();
		},

		activeRow: function() {
			var self = this,
				params = util.getHash(),
				partId = params['part_id'],
				callout = params['APK'];

			if (partId) {
				self.partIdHighlihtRow(partId);
				self.opts.onRowActive(self.getCalloutByPartId(partId));
			} else if (callout) {
				self.calloutHighlightRow(callout);
				self.opts.onRowActive(callout);
			}
		},

		calloutHighlightRow: function(callout) {
			var self = this;
			var $row1 = self.$lockWrapper.find('[data-callout=' + callout + ']');
			var $row2 = self.$floatTbBody.find('[data-callout=' + callout + ']');

			self.removeAllRowActive();
			self.addRowActive($row1, $row2);
		},

		partIdHighlihtRow: function(partId) {
			var self = this;
			var $row1 = self.$lockWrapper.find('[data-part-id=' + partId + ']');
			var $row2 = self.$floatTbBody.find('[data-part-id=' + partId + ']');

			self.removeAllRowActive();
			self.addRowActive($row1, $row2);
		},

		addRowActive: function($row1, $row2) {
			var self = this;

			if ($row1.length > 0 && $row2.length > 0) {
				$row1.addClass('active');
				$row2.addClass('active');
				$row1.scrollIntoView(150);
				$row2.scrollIntoView(150);
			}
		},

		removeAllRowActive: function() {
			var self = this;

			self.$lockWrapper.find('[data-callout]').removeClass('active');
			self.$floatTbBody.find('[data-callout]').removeClass('active');
		},

		getCalloutByPartId: function(partId) {
			var self = this,
				$row1 = self.$lockWrapper.find('[data-part-id=' + partId + ']');

			return $row1.attr('data-callout');
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

	return Parts;
})