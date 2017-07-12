define(['ajax', 'dialog', 'checkbox', 'jquery'], function(ajax, Dialog) {
	var defaultOpts = {};

	var shoppingCart = function(opts) {

		this.opts = $.extend(true, {}, defaultOpts, opts || {});
		this.init();
	};

	shoppingCart.prototype = {
		init: function() {
			var self = this;

			self.initEls();
			self.initEvents();
			self.initAttrs();
			self.initComponent();
		},

		initEls: function() {
			var self = this;

			self.cartWrapper = $('.cart-wrapper');
			self.$checkBoxs = self.cartWrapper.find('.checkbox');
			self.normalCheckBoxs = self.$checkBoxs.not('[data-action="select-all"]');
			self.specialCheckBoxs = self.$checkBoxs.filter('[data-action="select-all"]');
			self.totalSelection = self.cartWrapper.find('.total-selection');
			self.totalPrice = self.cartWrapper.find('.total-price');
			self.$qtyInput = self.cartWrapper.find('input[name="qty"]');

			self.$cartKindCount = $('#shoppingcart-kindCount');
			self.$cartHeaderWrapper = $('.cart-header-wrap');

			self.$shoppingCartBtn = $('#shoppingCartNotice');
		},


		initEvents: function() {
			var self = this;

			self.$shoppingCartBtn.on('mouseenter', function() {
				self.loadMiniCart();
				$(this).off('mouseenter');
			});

			self.cartWrapper.on('click', '[data-action]', function() {
				var $this = $(this),
					action = $this.attr('data-action');

				switch (action) {
					case 'delete-header-single':
						self.deleteHeaderSingle($(this));
						break;
					case 'delete-single':
						self.deleteSingle($this);
						break;
					case 'delete-all':
						self.deleteMulti();
						break;
					case 'export':
						self.exportCartList();
						break;
					case 'export-order':
						self.exportOrder();
						break;
					case 'down':
						self.changQtybyBtn($this, -1);
						break;
					case 'up':
						self.changQtybyBtn($this, 1);
						break;
					default:
						break;
				}
			});

			self.$checkBoxs.on('evtAfterChange', function() {
				var $this = $(this);
				if ($this.attr('data-action') == 'select-all') {
					self.setAllSelected($(this));
				} else {
					self.postPartStatus($(this));
				}

			});
			self.$qtyInput.on('focus', function() {
				self.originalInput = $(this).val();
			});
			self.$qtyInput.on('blur', function() {
				self.changeQtyByInput($(this));
			});
		},

		initAttrs: function() {
			var self = this;

			self.firstLoad = true;
		},

		initComponent: function() {
			var self = this;

			self.getSummary();
		},

		setAllSelected: function($this) {
			var self = this,
				isAllSelected = !$this.hasClass('checked');

			if (isAllSelected) {
				self.$checkBoxs.not('.disabled').removeClass('checked');
				self.cartWrapper.find('.item').removeClass('checked');
				self.unSelectAll();
			} else {
				self.$checkBoxs.not('.disabled').addClass('checked');
				self.cartWrapper.find('.item').addClass('checked');
				self.selectAll();
			}
		},

		selectAll: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/select-all',
				type: 'post',
				success: function() {
					self.getSummary();
				}
			});
		},

		unSelectAll: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/unselect-all',
				type: 'post',
				success: function() {
					self.getSummary();
				}
			});
		},

		deleteGoods: function(params, callback) {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/delete',
				type: 'post',
				data: params,
				success: function(result) {
					if (typeof callback === 'function') {
						callback.apply(self, [result]);
					}
				}
			});
		},

		deleteSingle: function($this) {
			var self = this,
				currentWrapper = $this.closest('.item');

			var partCodes = currentWrapper.attr('data-code'),
				data = {
					partCodes: partCodes
				};


			new Dialog({
				content: globalConfig.trans['t_002'],
				onConfirm: function() {
					self.deleteGoods(data, function() {
						currentWrapper.remove();
						self.getSummary();
					});
				}
			});

		},

		deleteHeaderSingle: function($this) {
			var self = this,
				currentWrapper = $this.closest('.item'),
				partCodes = currentWrapper.attr('data-code'),
				data = {
					partCodes: partCodes
				};

			self.deleteGoods(data, function() {
				self.loadMiniCart();
			});
		},

		deleteMulti: function() {
			var self = this,
				wrappers = [],
				codes = [],
				data;

			$.each(self.normalCheckBoxs, function(index, dom) {
				var $dom = $(dom);
				if ($dom.hasClass('checked')) {
					var wrapper = $dom.closest('.item');
					wrappers.push(wrapper);
					codes.push(wrapper.attr('data-code'));
				}
			});

			data = {
				partCodes: codes.join(',')
			};
			if (!codes.length) {
				new Dialog({
					content: globalConfig.trans['t_003']
				});
				return false;
			}
			new Dialog({
				content: globalConfig.trans['t_004'],
				onConfirm: function() {
					self.deleteGoods(data, function() {
						$.each(wrappers, function(index, dom) {
							$(dom).remove();
						});
						self.getSummary();
					});
				}
			});
		},

		exportCartList: function() {
			var self = this;

			if (!self.getCheckedStatus()) {
				new Dialog({
					content: globalConfig.trans['t_003']
				})
				return;
			}
			location.href = globalConfig.path + '/cart/export';

		},

		exportOrder: function() {
			var self = this;

			if (!self.getCheckedStatus()) {
				new Dialog({
					content: globalConfig.trans['t_003']
				});
				return;
			}

			ajax.invoke({
				url: globalConfig.path + '/cart/submit',
				type: 'post',
				success: function(result) {
					location.href = globalConfig.path + '/v-order/' + result.orderNo;
				}
			});

		},

		changQtybyBtn: function($this, sign) {
			var self = this,
				currentWrapper = $this.closest('.item');

			if ($this.hasClass('disabled') || currentWrapper.hasClass('disabled')) {
				return;
			}
			var currentInput = currentWrapper.find('input[name="qty"]'),
				qty = parseInt(currentInput.val()) + sign * 1;

			self.updateQty($this, qty);
		},

		changeQtyByInput: function($this) {
			var self = this,
				qty = $this.val(),
				currentWrapper = $this.closest('.item');

			if (currentWrapper.hasClass('disabled')) {
				return;
			}
			self.updateQty($this, qty);
		},

		updateQty: function($this, qty) {
			var self = this,
				currentWrapper = $this.closest('.item'),
				partCode = currentWrapper.attr('data-code'),
				qtyTip = currentWrapper.find('.qty-tip'),
				currentInput = currentWrapper.find('input[name="qty"]'),
				amount = currentWrapper.find('.total span'),
				data;

			if (self.xhr) {
				self.xhr.abort();
			}
			data = {
				partCode: partCode,
				qty: qty
			}
			self.xhr = ajax.invoke({
				url: globalConfig.path + '/cart/update-qty',
				type: 'post',
				data: data,
				success: function(result) {
					if (result.reasonCode != 'NORMAL') {
						qtyTip.show().find('.text').text(result.tip);
					} else {
						qtyTip.hide();
					}
					currentInput.val(result.newQty);
					amount.text(result.itemAmount);
					self.getSummary();
				},
				failed: function(root) {
					if (root.code == 'QTY_NOT_NUMBER') {
						currentInput.val(self.originalInput);
					}
				}
			})

		},

		getSummary: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/summary',
				success: function(data) {
					if (!self.firstLoad && data.itemsNum == 0) {
						window.location.href = window.location.href;
					}
					if (data.amount) {
						self.totalPrice.find('.price').text(data.amount);
					} else {
						self.totalPrice.hide();
					}
					self.totalSelection.find('.product-num').text(data.selectedItemsNum);
					if (data.itemsNum == data.selectedItemsNum) {
						self.specialCheckBoxs.addClass('checked');
					} else {
						self.specialCheckBoxs.removeClass('checked');
					}
					self.firstLoad = false;
				}
			});
		},

		postPartStatus: function($dom) {
			var self = this,
				currentItem = $dom.closest('.item'),
				isSelected = $dom.hasClass('checked'),
				partCode = $dom.closest('.item').attr('data-code');

			if (isSelected) {
				currentItem.addClass('checked');
				self.selectPart(partCode);
			} else {
				currentItem.removeClass('checked');
				self.unselectPart(partCode);
			}

		},

		selectPart: function(partCode) {
			var self = this,
				data = {
					partCode: partCode
				};

			ajax.invoke({
				url: globalConfig.path + '/cart/select',
				type: 'post',
				data: data,
				success: function(result) {
					self.getSummary();
				}
			});

		},

		unselectPart: function(partCode) {
			var self = this,
				data = {
					partCode: partCode
				};

			ajax.invoke({
				url: globalConfig.path + '/cart/unselect',
				type: 'post',
				data: data,
				success: function(result) {
					self.getSummary();
				}
			});
		},

		getCheckedStatus: function() {
			var self = this,
				hasSelected = false;

			$.each(self.normalCheckBoxs, function(index, dom) {
				var $dom = $(dom);
				if ($dom.hasClass('checked')) {
					hasSelected = true;
					return false;
				}
			});

			return hasSelected;

		},

		loadMiniCart: function() {
			var self = this;

			self.getCartNum();
			self.getCartItem();
		},


		getCartNum: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/num',
				success: function(result) {
					self.$cartKindCount.text(result.num);
				}

			})
		},

		getCartItem: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.path + '/cart/snippet',
				dataType: 'html',
				success: function(result) {
					self.$cartHeaderWrapper.html(result);
				}
			})
		},

		addGoods: function(partCode, callback) {
			var self = this,
				params = {
					partCode: partCode
				};

			ajax.invoke({
				url: globalConfig.path + '/cart/add',
				type: 'post',
				data: params,
				success: function(result) {
					/*	self.showAddInfo();*/

					if (typeof callback === 'function') {
						callback.apply(self, [result]);
					}
					/*	self.hideAddInfo();*/
					self.loadMiniCart();
				},
				failed: function() {}
			})
		}
	};

	return shoppingCart;
})