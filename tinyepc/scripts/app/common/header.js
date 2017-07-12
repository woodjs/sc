require(['ajax', 'mustache', 'dialog', 'shoppingCart', 'amplify', 'jqExtend', 'jquery'], function(ajax, Mustache, Dialog, ShoppingCart) {
	var header = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();
			self.initComnponent();
			self.initSubscribe();
		},

		initEls: function() {
			var self = this;

			self.$searchBox = $('#header-search-box');
			self.$searchInput = self.$searchBox.find('input[name="q"]');
			self.$searchBtn = self.$searchBox.find('.header-search-btn');
			self.$searchTips = $('#search-tips-wrapper');
			self.$searchInputWrapper = $('.search-input-wrapper');

			self.$searchTipTempl = $('#search-tip-template').html();
			self.$navigation = $('.nav-box');
		},

		initAttrs: function() {
			var self = this;

			self.current = -1;
			self.historyXhr = null;
			self.suggestXhr = null;
		},

		initEvents: function() {
			var self = this;

			self.$searchBtn.on('click', function() {
				self.doSearch();
			});
			self.$searchInput.on('keyup', function(e) {
				if (e.which == 13) {
					self.doSearch();
				}
			});
			self.$searchInput.on('focus', function(e) {
				self.getHistorySearch($(this), e);
			});
			self.$searchInput.on('keyup', function(e) {
				self.getSuggestSearch($(this), e);
			});
			$(document).on('click', function(e) {
				if ($(e.target).closest('.search-input-wrapper').length == 0) {
					self.$searchTips.hide();
				}
			});
			self.$searchTips.on('click', '.tip-btn', function() {
				var action = $(this).attr('data-action');
				switch (action) {
					case 'delete':
						self.deleteHistory($(this));
						break;
					case 'reset':
						self.resetHistory();
						break;
					case 'close':
						self.closeHistoryLayer();
						break;
					default:
						break;
				}
				return false;
			});
			self.$navigation.on('click', '[data-action]', function() {
				var $dom = $(this),
					action = $dom.attr('data-action');

				switch (action) {
					case 'change-lang':
						self.changeLang($dom);
						break;
					default:
						break;
				}
			})
		},

		initComnponent: function() {
			var self = this;

			self.$searchBox.initPlaceHolder({
				topDistance: '8'
			});

			self.shoppingCart = new ShoppingCart();
			self.shoppingCart.getCartNum();
		},

		initSubscribe: function() {
			var self = this;

			amplify.subscribe('shoppingCartAdd', function(partNum, callback) {
				self.shoppingCart.addGoods(partNum, callback);
			});
		},

		doSearch: function() {
			var self = this,
				searchParam = self.$searchInput.val();

			if (!searchParam) {
				return;
			}

			window.location = globalConfig.path + '/search?q=' + searchParam;
		},

		chooseItemByKey: function(size) {
			var self = this;

			if (self.$searchTips.is(':hidden')) {
				return;
			}
			var $tipItem = $('.search-tip-item'),
				length = $tipItem.length,
				activeItem;

			self.current += size;
			if (self.current < 0) {
				self.current = length - 1;
			}
			self.current %= length;
			activeItem = $tipItem.eq(self.current);
			activeItem.addClass('active').siblings().removeClass('active');
			self.$searchInput.val(activeItem.find('.text').text());
		},

		getHistorySearch: function($this, e) {
			var self = this;

			if ($this.val()) {
				return self.getSuggestSearch($this, e);
			}
			if (self.historyXhr) {
				self.historyXhr.abort();
			}
			self.historyXhr = ajax.invoke({
				url: globalConfig.path + '/search/history-keywords',
				success: function(data) {
					if (!data.length) {
						return self.$searchTips.hide();
					}
					self.$searchTips.show().addClass('history');
					self.renderList(self.constructData(data));
				},
				failed: function() {

				},
				complete: function() {
					self.current = -1;
				}
			})
		},

		getSuggestSearch: function($this, e) {
			var self = this,
				query = $this.val();

			if (e.which === 38) {
				return self.chooseItemByKey(-1);
			}
			if (e.which === 40) {
				return self.chooseItemByKey(1);
			}
			if (query.length == 0) {
				return self.getHistorySearch($this);
			}
			if (self.suggestXhr) {
				self.suggestXhr.abort();
			}
			self.suggestXhr = ajax.invoke({
				url: globalConfig.path + '/search/suggest?q=' + encodeURIComponent(query),
				success: function(data) {
					if (!data.length) {
						return self.$searchTips.hide();
					}
					self.$searchTips.show().removeClass('history');
					self.renderList(data)
				},
				failed: function() {

				},
				complete: function() {
					self.current = -1;
				}
			})
		},

		constructData: function(data) {
			var self = this,
				result = [];

			for (var i = 0; i < data.length; i++) {
				var text = data[i];
				result.push({
					input: text,
					output: text
				});
			}

			return result;
		},

		renderList: function(data) {
			var self = this,
				html = Mustache.render(self.$searchTipTempl, {
					data: data
				});

			self.$searchTips.html(html);
		},

		deleteHistory: function($this) {
			var self = this,
				query = $this.siblings('.text').text(),
				params = {
					q: query
				};

			ajax.invoke({
				url: globalConfig.path + '/search/delete-keyword',
				type: 'POST',
				data: params,
				success: function() {
					self.getHistorySearch(self.$searchInput);
				}
			});
		},
		resetHistory: function() {
			var self = this;

			new Dialog({
				content: globalConfig.trans['t_001'],
				esc: false,
				onConfirm: function() {
					ajax.invoke({
						url: globalConfig.path + '/search/clear-keywords',
						type: 'POST',
						success: function() {
							self.$searchTips.hide();
						}
					});
				}
			});

		},

		closeHistoryLayer: function() {
			var self = this;

			self.$searchTips.hide();
		},

		changeLang: function($dom) {
			var self = this,
				lang = $dom.attr('data-lang-code');

			ajax.invoke({
				url: globalConfig.path + '/change-locale?locale=' + lang,
				success: function() {
					location.reload();
				}
			});
		}
	}

	header.init();
})