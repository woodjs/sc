require(['ajax', 'mustache', 'crumbs', 'util', 'hashchange', 'jquery', 'domReady!', 'header'], function(ajax, Mustache, Crumbs, util) {
	var home = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initEvents();
			self.initComponnet();
			self.initSearchCondition();
			self.pageReadyToRender();
		},

		initEls: function() {
			var self = this;

			self.$seriesContent = $('#series-content');
			self.$tabBtn = $('.tab-btn');
			self.$seriesTepl = $('#brand-serires-templ').html();

			self.$leadContent = $('.lead-content');
			self.$searchBlock = $('#serach-block');

			self.$conditionItemContent = $('#condition-item-wrapper');
		},

		initAttrs: function() {
			var self = this;

			self.condition = {};
			self.crumbsConfig = {};
			self.url = '/mapping/lnks';
			self.modelUrl = '/usage';
			self.mappingSize = parseInt(globalConfig.mappingSize);
			self.currentChoiceTempl = '<span class="current">[</span><span class="current current-choice"> {{value}} </span><span class="current">]</span>';
			self.wrapperTempl = '<div class="condition-item hide" data-key="m_{{lvl}}"></div>';
			self.conditionTempl = '{{#data}}<div class="condition-title"><span class="bold-text title-text">{{levelName}}</span><span class="current-choice-wrapper"></span></div><div class="condition-content">{{#array}}<div><a href="{{url}}" target="{{target}}" class="text-link secondary" data-id="{{id}}" data-code="{{code}}" data-lvl="{{lvl}}" data-name="{{name}}">{{name}}</a></div>{{/array}}</div>{{/data}}<div class="condition-btn-wrapper"><a href="javascript:;" class="condition-btn"><span class="btn-collaspe"><i class="iconfont icon-collapse"></i><span class="text">' + globalConfig.trans['t_006'] + '</span></span><span class="btn-expand"><i class="iconfont icon-expand"></i><span class="text">' + globalConfig.trans['t_007'] + '</span></span></a></div>';
			self.preventHashChange = false;
			self.xhr = null;
			self.num = 1;

		},

		initEvents: function() {
			var self = this;

			self.$tabBtn.on('click', function(e, params) {
				self.afterNodeSelection($(this), params);
			});
			self.$seriesContent.on('click', '.series-btn', function(e, params, isPreventHash) {
				self.afterNodeSelection($(this), params);
			});
			self.$conditionItemContent.on('click', '.text-link', function(e, params, isPreventHash) {
				self.setCurrentChoice($(this));
				self.afterNodeSelection($(this), params);
			});

			self.$conditionItemContent.on('click', '.condition-btn', function() {
				self.setConditonBtnsStatus($(this));
			});

			$(window).hashchange(function() {
				if (self.preventHashChange) {
					self.preventHashChange = false;
					return;
				}

				self.renderByHash();
				self.preventHashChange = false;
			});
		},

		initComponnet: function() {
			var self = this;

			self.crumbs = new Crumbs();
		},

		initSearchCondition: function() {
			var self = this,
				html = '';

			for (var i = 3; i <= self.mappingSize; i++) {
				html += self.wrapperTempl.replace(/\{\{lvl\}\}/, i);
			}
			self.$conditionItemContent.append(html);
		},

		pageReadyToRender: function() {
			var self = this

			self.renderByHash();
		},

		afterNodeSelection: function($node, hashParams) {
			var self = this,
				level = $node.attr('data-lvl');

			$node.closest('[data-key]').find('.active').removeClass('active');
			$node.addClass('active');

			self.preventHashChange = true;
			if (hashParams && !self.isEmptyObject(hashParams)) {
				var params = self.getParamsFormHash(hashParams, level);
			} else {
				var params = self.getAllParams(level);
			}

			if (level == self.mappingSize) {
				$node.removeClass('active');
				self.click = false;
				return;
			}

			if (level == 1 && (!hashParams || self.isEmptyObject(hashParams))) {
				self.hideYearAndModel();
			}
			if (level == 2) {
				self.showYearAndModel();
			}

			self.condition = params;
			self.setCrumbs(level);
			self.getNextData(params, ++level, hashParams);
		},

		renderByHash: function(params) {
			var self = this,
				hashParams = params || util.getHash(),
				hashChoosedItem = self.$tabBtn.filter('[data-id="' + hashParams['m_1'] + '"]'),
				$choicedBrand = hashChoosedItem.length ? hashChoosedItem : self.$tabBtn.eq(0);

			$choicedBrand.addClass('active');
			self.afterNodeSelection($choicedBrand, hashParams);
		},

		getParamsFormHash: function(hashParam, level) {
			var self = this,
				params = {};

			for (var i = 1; i <= level; i++) {
				var key = 'm_' + i;
				params[key] = hashParam[key] || '-1';
			}

			return params;
		},

		setCrumbsByHash: function() {
			var self = this;

			var params = self.getAllParams(level);
		},

		showYearAndModel: function() {
			var self = this;

			self.$leadContent.hide();
			self.$conditionItemContent.show();
		},

		hideYearAndModel: function() {
			var self = this;

			self.$leadContent.show();
			self.$conditionItemContent.hide();
		},

		getAllParams: function(level) {
			var self = this;

			var params = {};


			for (var i = 1; i <= level; i++) {
				var item = 'm_' + i;
				var currentBlock = $('[data-key=' + item + ']');
				var currentItem = currentBlock.find('.active');
				var value = currentItem.attr('data-id');
				var name = currentItem.attr('data-name');

				params[item] = value || '';
			}

			return params;
		},

		getCrumbsConfig: function(level) {
			var self = this;

			var crumbs = {},
				crumbsUrl = globalConfig.path + '#';

			for (var i = 1; i <= level; i++) {
				var item = 'm_' + i;
				var currentBlock = $('[data-key=' + item + ']');
				var currentItem = currentBlock.find('.active');
				var value = currentItem.attr('data-id');
				var name = currentItem.attr('data-name');

				if (i == 1) {
					crumbsUrl += item + '=' + value;
				} else {
					crumbsUrl += '&' + item + '=' + value
				}
				crumbs['m_' + i] = {
					id: value,
					name: name,
					key: globalConfig.trans['m_' + i],
					paramKey: 'm_' + i,
					url: crumbsUrl
				}
			}

			self.crumbsConfig = crumbs;
			return crumbs;
		},

		linkToModel: function(params) {
			var self = this,
				urlParams = $.param(params);

			window.open(globalConfig.path + self.modelUrl + '?' + urlParams, '_blank');
		},

		getNextData: function(params, level, hashparams) {
			var self = this,
				templWrapper = $('[data-key=m_' + level + ']');

			if (self.xhr) {
				self.xhr.abort();
			}
			self.xhr = ajax.invoke({
				url: globalConfig.path + self.url,
				data: params,
				success: function(data) {
					self.afterGetSuccess(data, level, hashparams);
				}
			});
		},

		afterGetSuccess: function(data, level, hashparams) {
			var self = this;

			if (level == 2) {
				data = self.reConstructData(data, level);
				self.renderTempl(data, level, self.$seriesTepl)
			} else {
				data = self.reConstructData(data, level);
				self.renderTempl(data, level, self.conditionTempl);

				if (self.num == 1) {
					self.calConditionMaxHeight();
					self.num++;
				}
			}
			self.setCascadeClick(level, hashparams);

		},

		renderTempl: function(data, level, templ) {

			var self = this,
				templWrapper = $('[data-key=m_' + level + ']'),
				html = Mustache.render(templ, {
					data: data
				});

			templWrapper.show().html(html);
		},

		reConstructData: function(data, level) {
			var self = this,
				url = '',
				searchLevel = level - 1,
				params = self.getAllParams(searchLevel),
				result = {};

			if (level > 2) {
				data.unshift({
					name: globalConfig.trans['m_' + level + '_all'],
					id: '-1',
					code: '-1',
					lvl: level
				});
			}
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				if (level == self.mappingSize) {
					params['m_' + level] = item.id;
					item['url'] = globalConfig.path + self.modelUrl + '?' + $.param(params);
					if (level == 2) {
						item['target'] = '_self';
					} else {
						item['target'] = '_blank';	
					}
				} else {
					item['url'] = 'javascript:;'
					item['target'] = '_self';
				}
			}

			if (level == 2) {
				return data;
			}

			result['levelName'] = globalConfig.trans['m_' + level];
			result['array'] = data;


			return result;
		},

		setCascadeClick: function(level, hashparams) {
			var self = this;

			var levelBlock = $('[data-key=m_' + level + ']');
			self.controlConditionBtns(levelBlock);

			if (level === self.mappingSize) {
				self.setHash(self.condition);
				if (hashparams) {
					self.preventHashChange = false;
				}
				return;
			}

			var levelItems = levelBlock.find('[data-lvl]');
			var currentVal = hashparams && hashparams['m_' + level] || '-1';

			var $node = levelItems.filter('[data-id="' + currentVal + '"]');
			$node && $node.trigger('click', hashparams || '');
		},

		setCurrentChoice: function($this) {
			var self = this,
				$node = $this,
				level = $node.attr('data-lvl'),
				levelBlock = $node.closest('.condition-item');

			if (level > 2 && level != self.mappingSize) {
				levelBlock.find('.current-choice-wrapper').html(self.currentChoiceTempl.replace(/\{\{value\}\}/, $node.text()));
			}
		},

		controlConditionBtns: function($block) {
			var self = this,
				$items = $block.find('[data-lvl]');

			if ($items.length > 2) {
				$block.removeClass('expand disapper').addClass('collapse');
			} else {
				$block.removeClass('expand collapse').addClass('disapper');
			}
		},

		calConditionMaxHeight: function() {
			var self = this,
				containerH = self.$searchBlock.outerHeight(),
				headLineH = $('.headline').eq(0).outerHeight(),
				expandH = 75,
				containerSize = self.mappingSize - 2,
				itemH = (containerH - headLineH) / containerSize - expandH;

			self.conditionItemH = itemH;
		},

		setConditonBtnsStatus: function($item) {
			var self = this,
				$operateItem = $item.closest('.condition-item'),
				$operateContent = $operateItem.find('.condition-content');

			if ($operateItem.hasClass('collapse')) {

				$operateItem.removeClass('collapse').addClass('expand');
				$operateContent.css({
					maxHeight: self.conditionItemH
				});
				return;

			}
			if ($operateItem.hasClass('expand')) {

				$operateItem.removeClass('expand').addClass('collapse');
				$operateContent.css({
					maxHeight: 82 + 'px'
				});
				return;
			}
		},

		setCrumbs: function(level) {
			var self = this,
				crumbs = self.getCrumbsConfig(level);

			self.crumbs.changeAllCrumbs(crumbs);
		},

		setHash: function(params) {
			var self = this,
				hashParams = $.extend(true, {}, params);

			if (self.isEmptyObject(hashParams)) {
				return;
			}
			window.location.hash = '#' + $.param(hashParams);
		},

		isEmptyObject: function(obj) {
			var self = this,
				num = 0;

			for (var i in obj) {
				if (i) {
					num++;
				}
			}
			if (!num) {
				return true;
			} else {
				return false;
			}
		}
	};

	home.init();
})