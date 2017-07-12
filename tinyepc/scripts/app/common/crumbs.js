define(['jquery'], function() {
	var defaultOpts = {
		needGroup: true
	};

	var crumbs = function(opts) {
		this.opts = $.extend(true, {}, defaultOpts, opts || {});
		this.init();
	};

	crumbs.prototype = {
		init: function() {
			var self = this;

			self.initEls();
			self.initAttrs();
			self.initTempl();
			self.initCrumbsConfig();
			self.initComponent();
			self.renderCrumbs(self.crumbConfig);
		},

		initEls: function() {
			var self = this;

			self.$crumbsBar = $('#crumbs-bar');
		},

		initAttrs: function() {
			var self = this;

			self.mappings = typeof mappings == 'object' ? mappings : null;
			self.mappingSize = parseInt(globalConfig.mappingSize);
			self.structSize = parseInt(globalConfig.structSize);
			self.crumbConfig = {};
			self.crumbsGroup = {};
			self.trans = globalConfig.trans;
		},

		initComponent: function() {
			var self = this;

			if (self.opts.needGroup) {
				self.initCrumbsGroup();
			}
		},

		initTempl: function() {
			var self = this;

			self.crumbTempl = '<a class="crumbs-item" href="{{url}}" data-crumbskey="{{paramKey}}"><span class="paging-icon"><i class="iconfont icon-arrow-right"></i></span><span>{{key}}：</span><span>{{name}}</span></a>';
		},

		initCrumbsConfig: function() {
			var self = this,
				crumbObj = {},
				crumbsUrl = globalConfig.path + '/#';

			if (!self.mappings) {
				return;
			}
			for (var i = 0; i < self.mappingSize; i++) {
				crumbObj = {};
				crumbObj.code = self.mappings[i].code;
				crumbObj.id = self.mappings[i].id;
				crumbObj.lvl = self.mappings[i].lvl;
				crumbObj.key = self.trans['m_' + (i + 1)];
				crumbObj.name = self.mappings[i].name;
				crumbObj.paramKey = 'm_' + (i + 1);
				if (i == 0) {
					crumbsUrl += 'm_' + (i + 1) + '=' + self.mappings[i].id;
				} else {
					crumbsUrl += '&m_' + (i + 1) + '=' + self.mappings[i].id;
				}
				if (i == self.mappingSize - 1) {
					crumbObj.url = window.location.href;
				} else {
					crumbObj.url = crumbsUrl;
				}

				self.crumbConfig['m_' + (i + 1)] = crumbObj;
			}
		},

		initCrumbsGroup: function() {
			var self = this;

			self.groupConfig = {
				paramKey: 'g_1',
				key: self.trans['g_1'],
				name: '',
				code: '',
				id: '',
				url: 'javascript:;'
			};
		},

		renderCrumbs: function(obj) {
			var self = this,
				html = '';

			$.each(obj, function(index, item) {
				var templStr = self.crumbTempl.replace(/\{\{key\}\}/g, item.key).replace(/\{\{name\}\}/g, item.name).replace(/\{\{paramKey\}\}/g, item.paramKey).replace(/\{\{url\}\}/g, item.url);
				html += templStr;
			});

			self.$crumbsBar.html(html);
		},

		changeAllCrumbs: function(opts) {
			var self = this,
				config = self.crumbConfig;

			if (!opts['g_1']) {
				config = {};
			}
			$.each(opts, function(paramKey, item) {
				if (paramKey == 'g_1') {
					config['g_1'] = self.groupConfig;
				}
				if (!config[paramKey]) {
					config[paramKey] = {};
				}
				var operateObj = config[paramKey];
				$.each(item, function(index, value) {
					operateObj[index] = value || '';
				});

			});
			self.crumbConfig = config;
			self.renderCrumbs(config);
		}
	};

	return crumbs;
})