require(['ajax', 'tree', 'legend', 'parts', 'crumbs', 'util', 'hashchange', 'jquery', 'lazyload', 'header', 'domReady!'],
	function(ajax, Tree, Legend, Parts, Crumbs, util) {

		var usage = {
			init: function() {
				var self = this;

				self.initEls();
				self.initComponent();
				self.initAttrs();
				self.initEvents();
				self.pageReadyToRender();
			},

			initEls: function() {
				var self = this;

				self.$treeBlock = $('#tree-block');
				self.$leadBlock = $('#lead-block');
				self.$navTree = $('#navigation-tree');
				self.$legendParts = $('#legend-parts');
				self.$thumbnailContainer = $('#thumbnail-block');

				self.$lengendBtn = $('.lengend-btn');
			},

			initAttrs: function() {
				var self = this;

				self.mappingSize = parseInt(globalConfig.mappingSize);

				self.setCurrentCondition();
			},

			initComponent: function() {
				var self = this;

				self.tree = new Tree({
					onSelectionNode: function($node) {
						self.setHash($node);
					}
				});

				self.legend = new Legend({
					onSelectionCallout: function(callout) {
						if (callout && callout.length) {
							self.parts.calloutHighlightRow(callout[0]);
							self.replaceHash('callout', callout[0]);
							self.preventHashChange = true;
						}
					}
				});

				self.parts = new Parts({
					onRowSelection: function(callout, partId) {
						self.legend.hotpoint.linkHotpoint([callout]);
						self.replaceHash('part_id', partId);
						self.preventHashChange = true;
					},
					onRowActive: function(callout) {
						self.legend.setActiveCallout(callout);
					}
				});

				self.crumbs = new Crumbs();
			},

			initEvents: function() {
				var self = this;

				self.$thumbnailContainer.on('click', '.secondary', function() {
					var id = $(this).attr('data-id');
					var $node = self.tree.getNodeById(id);

					self.tree.expandNode($node);
					self.tree.selectionNode($node);
				});

				self.$lengendBtn.on('click', function() {
					self.controlLengend($(this));
				});

				$(window).hashchange(function() {
					if (self.preventHashChange) {
						self.preventHashChange = false;
						return;
					}

					var hashParams = util.getHash(),
						lastParams = self.getLastParams(hashParams),
						params = $.extend(true, {}, self.currentCondition, hashParams),
						$node = self.tree.getNodeById(lastParams.id),
						urlVin = util.getUrlParams('vin');

					if (urlVin) {
						params['vin'] = urlVin;
					}

					self.changeCrumbs($node);
					self.render(params, lastParams.level);
					self.setTreeNodeStatus($node);
				});
			},

			setHash: function($node) {
				var self = this,
					hashParams = self.getHashParams($node);

				window.location.hash = '#' + $.param(hashParams);
			},

			replaceHash: function(type, val) {
				if (!val) return;

				var self = this,
					hashParams = util.getHash();

				delete hashParams['part_id'];
				delete hashParams['APK'];

				hashParams[type] = val;
				window.location.hash = '#' + $.param(hashParams);
			},

			controlLengend: function($btn) {
				var self = this,
					$opearateDom = $btn.hasClass('left') ? self.$treeBlock : $('#parts-container');

				if ($btn.hasClass('collapse')) {
					$btn.removeClass('collapse').addClass('expand');
					$opearateDom.show();
				} else {
					$btn.removeClass('expand').addClass('collapse');
					$opearateDom.hide();
				}

				self.legend.hotpoint.resizeToAdjust();
			},

			setCurrentCondition: function() {
				var self = this,
					params = window.params,
					condition = {};

				for (var i = 1; i <= self.mappingSize; i++) {
					condition['m_' + i] = params['m_' + i];
				}

				self.currentCondition = condition;
			},

			pageReadyToRender: function() {
				var self = this,
					$node,
					lastParams = self.getLastParams(util.getHash());

				if (lastParams.id) {
					$node = self.tree.getNodeById(lastParams.id);
					self.setTreeNodeStatus($node, true);
					self.changeCrumbs($node);
					self.render(self.getParams($node), lastParams.level);
				} else {
					self.$leadBlock.show();
				}
			},

			render: function(params, level) {
				var self = this;

				if (self.tree.isLeaf(level)) {
					self.renderLegendAndParts(params);
				} else {
					self.renderThumbnail(params);
				}
			},

			renderThumbnail: function(params) {
				var self = this,
					url = globalConfig.path + '/usage/struct/flat-descendant';

				self.showThumbnail();

				if (self.xhr) {
					self.xhr.abort();
				}

				self.xhr = ajax.invoke({
					url: url,
					dataType: 'html',
					data: params,
					complete: function() {
						self.xhr = null;
					},
					success: function(html) {
						self.$thumbnailContainer.html(html);
						self.lazyload();
					}
				});
			},

			renderLegendAndParts: function(params) {
				var self = this;

				self.showLegendParts();
				self.legend.load(params);
				self.parts.load(params);
			},

			showLegendParts: function() {
				var self = this;

				self.$leadBlock.hide();
				self.$thumbnailContainer.hide();
				self.$legendParts.show()
			},

			showThumbnail: function() {
				var self = this;

				self.$leadBlock.hide();
				self.$thumbnailContainer.show();
				self.$legendParts.hide();
			},

			lazyload: function() {
				var self = this;

				$('.lazy').error(function() {
					this.src = globalConfig.path + "/images/no_image.jpg";
				}).lazyload({
					effect: "fadeIn",
					no_fake_img_loader: true,
					container: $('.thumbnail-item-wrapper')
				});
			},

			getHashParams: function($node) {
				var self = this,
					params = {},
					level = $node.attr('data-lvl');

				for (var i = level; i >= 1; i--) {
					params['s_' + i] = $node.attr('data-id');
					$node = $node.parents('.child').siblings('.tree-node');
				}

				return params;
			},

			getParams: function($node) {
				var self = this,
					level = $node.attr('data-lvl'),
					params = $.extend(true, {}, self.currentCondition),
					urlVin = util.getUrlParams('vin');

				for (var i = level; i >= 1; i--) {
					params['s_' + i] = $node.attr('data-id');
					$node = $node.parents('.child').siblings('.tree-node');
				}

				if (urlVin) {
					params['vin'] = urlVin
				}

				return params;
			},

			getLastParams: function(params) {
				var self = this,
					level,
					leaf = {
						level: 1
					};

				for (var key in params) {
					if (key.indexOf('s_') > -1) {
						level = parseInt(key.split('_')[1]);
						if (level >= leaf.level) {
							leaf = {
								id: params[key],
								level: level
							};
						}
					}
				}

				return leaf;
			},

			setTreeNodeStatus: function($node, status) {
				var self = this;

				self.tree.expandNode($node, status);
				self.tree.setSelectionNodeBg($node);
			},

			changeCrumbs: function($node) {
				if (!$node) return;

				var self = this,
					text,
					currentLevel = $node.attr('data-lvl'),
					groupText = [];

				for (var i = currentLevel; i >= 1; i--) {
					if (i == 1) {
						text = $node.attr('data-text') + ' ';
					} else {
						text = ' ' + $node.attr('data-text');
					}
					$node = $node.parents('.child').siblings('.tree-node');
					groupText.unshift(text);
				}

				self.crumbs.changeAllCrumbs({
					'g_1': {
						name: groupText.join('-')
					}
				});
			}
		}

		usage.init();
	});