define(['lazyload', 'jquery'], function() {
	var defaultOpts = {
		wrapper: '.part-content',
		importUrl: null,
		params: null,
		width: '110',
		margin: '10',
		num: '3',
		landScope: false,
		manifierNeed: false,
		firstChoosed: true //第一个默认被选中
	};

	var picPreview = function(opts) {
		this.options = $.extend(true, {}, defaultOpts, opts || {});
		this.init();
	}

	picPreview.prototype = {

		init: function() {
			var self = this;

			self.buildEls();
			self.setAttr();
			self.initComponents();
			self.initEvents();
		},

		buildEls: function() {
			var self = this;

			self.preview = $(self.options.wrapper);
			self.buildSameEls();
		},

		buildSameEls: function() {
			var self = this;

			self.specImg = self.preview.find('.spec-img img');
			self.forwardBtn = self.preview.find('.spec-btn.left');
			self.backwardBtn = self.preview.find('.spec-btn.right');
			self.itemsListContainer = self.preview.find('.spec-items');
			self.itemsList = self.preview.find('.spec-items-list');
			self.listItem = self.preview.find('.spec-item');
		},

		setAttr: function() {
			var self = this;

			self.leftWidth = 0;
			self.lock = true;
			self.currentIndex = parseInt(self.options.num);
			self.img = [];
			self.magnifier = false;
		},

		initComponents: function(callbacks) {
			var self = this;

			self.lazyload();
			if (self.options.importUrl) {
				ajax.invoke({
					url: globalConfig.context.path + self.options.importUrl,
					type: 'GET',
					success: function(data) {
						self.img = data.img;
					}
				});
			}
			if (self.options.manifierNeed) {
				self.magnifier = new Magnifier();
			}
			if (self.options.firstChoosed) {
				self.selectFirst();
			}
			self.setPicContWidth();
			self.getBigPics();
			self.setBtn();
		},

		initEvents: function() {
			var self = this;

			self.listItem.on('mouseenter', function() {
				self.setCoverField($(this));
				self.itemHover($(this));
			});
			self.backwardBtn.click(function() {
				self.setCoverField($(this));
				self.btnHandler('right');
			});
			self.forwardBtn.click(function() {
				self.setCoverField($(this));
				self.btnHandler('left');
			});
		},

		lazyload: function() {
			$('.lazy').error(function() {
				this.src = globalConfig.path + "/images/no_image.jpg";
			}).lazyload({
				effect: "fadeIn",
				no_fake_img_loader: true
			});
		},

		/*设置作用对象*/
		setCoverField: function($this) {
			var self = this;

			self.preview = $this.closest(self.options.wrapper);
			console.log(self.preview);
			self.buildSameEls();
		},

		/*获取所有大图*/
		getBigPics: function() {
			var self = this;

			var size = self.listItem.size();

			for (i = 0; i < size; i++) {
				var imgUrl = self.listItem.eq(i).attr('data-url');
				self.img.push(imgUrl);
			}
			self.preloadIamges(self.img);
		},

		/*预加载图片*/
		preloadIamges: function(img) {
			var self = this;

			for (var i = 0; i < img.length; i++) {
				$('<img />').attr('src', img[i]);
			}
		},

		/*默认第一个被选中*/
		selectFirst: function() {
			var self = this;

			self.listItem.eq(0).addClass('active');
		},

		/*增加鼠标效果*/
		itemHover: function($this) {
			var self = this;

			var index = parseInt($this.index());
			var size = self.listItem.size();
			var imgUrl = $this.find('.img-wrapper').attr('data-url');

			self.listItem.filter('.active').removeClass('active')
			$this.addClass('active');
			if (size > index) {
				self.specImg.attr('src', imgUrl).attr('img-url', imgUrl);
			}
		},

		/*设置图片容器宽度*/
		setPicContWidth: function() {
			var self = this;

			var size = self.listItem.size(),
				singleWidth = parseInt(self.options.width),
				singleMargin = parseInt(self.options.margin),
				width = size * (singleWidth + singleMargin);

			self.itemsList.css({
				'width': width + 'px',
				'left': 0,
				'top': 0
			});
		},

		/*控制按钮是否可用*/
		setBtn: function() {
			var self = this;

			var size = self.listItem.size(),
				num = self.options.num;

			if (size <= num) {
				self.forwardBtn.addClass('disabled');
				self.backwardBtn.addClass('disabled');
			} else if (size > num) {
				self.forwardBtn.addClass('disabled');
			}
		},

		btnHandler: function(action) {
			var self = this,
				controlBtn, callback, resolveNum, sign;

			switch (action) {
				case 'left':
					controlBtn = self.forwardBtn;
					callback = self.reduceBtnAfter;
					sign = 1;
					break;
				case 'right':
					controlBtn = self.backwardBtn;
					callback = self.addBtnAfter;
					sign = -1;
					break;
				default:
					break;
			}

			if (controlBtn.hasClass('disabled') || !self.lock) {
				return false;
			}

			var singleWidth = parseInt(self.options.width),
				singleMargin = parseInt(self.options.margin),
				width = singleWidth + singleMargin,
				num = parseInt(self.options.num);

			self.lock = false;
			resolveNum = self.options.landScope ? num : 1;
			self.leftWidth += self.options.landScope ? sign * width * num : sign * width;

			self.itemsList.animate({
				'left': self.leftWidth + 'px'
			}, 200, function() {
				callback.apply(self, [resolveNum]);
			});
		},

		/*点击右侧按钮的回调事件*/
		addBtnAfter: function(num) {
			var self = this;
			console.log(111);
			var size = self.listItem.size();

			self.forwardBtn.removeClass('disabled');
			self.currentIndex += num;
			if (self.currentIndex >= size) {
				self.backwardBtn.addClass('disabled');
			}
			self.lock = true;
		},

		/*点击左侧按钮的回调事件*/
		reduceBtnAfter: function(num) {
			var self = this;

			var size = self.listItem.size(),
				landnum = self.options.num;

			self.backwardBtn.removeClass('disabled');
			self.currentIndex -= num;

			if (self.currentIndex <= landnum) {
				self.currentIndex = parseInt(landnum);
				self.forwardBtn.addClass('disabled');
			}
			self.lock = true;
		}

	};

	return picPreview;
})