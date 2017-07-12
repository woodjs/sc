define(['crumbs', 'jquery'], function(Crumbs) {
	var defaultOpt = {
		onSelectionNode: function() {},
	};

	var Tree = function(opts) {
		this.opts = $.extend(true, {}, defaultOpt, opts);

		this.init();
	};

	Tree.prototype = {
		init: function() {
			var self = this;

			self.initEls();
			self.initEvents();
		},

		initEls: function() {
			var self = this;

			self.$navTree = $('#navigation-tree');
		},

		initEvents: function() {
			var self = this;

			self.$navTree.on('click', '.tree-node', function() {
				self.expandCollapsedNode($(this));
				self.selectionNode($(this));
			});
		},

		expandCollapsedNode: function($btn) {
			var self = this,
				$nodeWapper = $btn.closest('.condition-item-group');

			if ($nodeWapper.hasClass('collapse')) {
				$nodeWapper.removeClass('collapse').addClass('expand');
			} else {
				$nodeWapper.removeClass('expand').addClass('collapse');
			}
		},

		expandNode: function($node, status) {
			var self = this;

			while ($node.length) {
				var $nodeParent = $node.parent();
				if (!!status && $nodeParent.parent('.parent').length) {
					$node = $nodeParent;
				} else {
					$node = $nodeParent.parents('.condition-item-group');
				}
				if ($node.length) {
					if (!$node.hasClass('expand')) {
						$node.removeClass('collapse').addClass('expand');

					}
				}
			}
		},

		selectionNode: function($node) {
			var self = this;

			self.setSelectionNodeBg($node);
			self.opts.onSelectionNode.apply(self, [$node]);
		},

		setSelectionNodeBg: function($node) {
			var self = this;

			self.$navTree.find('.active').removeClass('active');
			$node.closest('.condition-item-group').addClass('active');
		},

		getNodeById: function(id) {
			var self = this;
			var $node = self.$navTree.find('[data-id=' + id + ']');

			return $node;
		},

		isLeaf: function(level) {
			var self = this;

			return level == parseInt(globalConfig.structSize);
		}
	};

	return Tree;
});