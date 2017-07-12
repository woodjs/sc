define(['hotpoint', 'ajax', 'loading', 'jquery'], function(Hotpoint, ajax) {

	var defaultOpts = {
		callbacks: {
			onSelectionCallout: function() {}
		}
	};

	var Legend = function(options) {
		this.opts = $.extend({}, defaultOpts, options || {});

		this.init();
	};

	Legend.prototype = {
		init: function() {
			var self = this;

			self.initEls();
			self.initHotpoint();
		},

		initEls: function() {
			var self = this;

			self.$legendTitle = $('#legend-title');
			self.$legendContainer = $('#legend-container');
		},

		initHotpoint: function() {
			var self = this;

			self.hotpoint = new Hotpoint({
				radius: 10,
				dock: "TL",
				radius: 10,
				loading: false,
				maxZoom: 10,
				assistiveTool: "2",
				tbodyId: "parts-body",
				renderToId: "legend-container",
				selectedRowBgClass: "checked",
				nopic: globalConfig.path + '/images/no_image.jpg',
				callbacks: {
					onSelectionCallout: function(callouts) {
						if (typeof self.opts.onSelectionCallout === 'function') {
							self.opts.onSelectionCallout.apply(null, [callouts]);
						}
					},
					onLegendDbClick: function() {
						if (this.opts.legendExist) {
							this.resetLegend();
							this.redraw();
						}
					},
					onLegendAfterLoad: function() {
						self.$legendContainer.hideLoading();
					},
					onPrint: function() {
						self.printLegendParts();
					}
				}
			});
		},

		load: function(params) {
			var self = this,
				url = globalConfig.path + '/usage/struct';

			self.params = params;

			if (self.xhr) {
				self.xhr.abort();
			}

			self.$legendContainer.hideLoading();

			self.xhr = ajax.invoke({
				type: "GET",
				url: url,
				data: params,
				beforeSend: function() {
					self.$legendContainer.showLoading();
				},
				complete: function() {
					self.xhr = null;
				},
				success: function(result) {
					self.renderLegend(result);
				},
				failed: function(error) {
					self.hotpoint.destroyLegend();
					self.hotpoint.loadErrorImg();
				}
			});
		},

		renderLegend: function(result) {
			var self = this;
			var struct = result.struct || {};
			var title = struct.code + ' - ' + struct.name;

			self.$legendTitle.text(title);

			self.hotpoint.bindLegend({
				src: globalConfig.resHost + struct.fileUri,
				data: result.xys,
				swfLegendWidth: struct.width,
				swfLegendHeight: struct.height
			}, function() {
				self.legendFinished = true;

				if (self.activeCallout) {
					self.hotpoint.linkHotpoint([self.activeCallout]);
					self.activeCallout = null;
				}
			});
		},

		setActiveCallout: function(callout) {
			var self = this;

			if (self.legendFinished) {
				self.hotpoint.linkHotpoint([callout])
			} else {
				self.activeCallout = callout;
			}
		},

		printLegendParts: function() {
			var self = this,
				searchParam = window.location.search,
				hash = window.location.hash.slice(1);

			window.open(globalConfig.path + '/usage/full-screen' + searchParam + '&' + hash + '&print=1', '_blank');
		}
	};

	return Legend;
})