(function(fn) {

	if (typeof exports === 'object' && typeof exports.module === 'object') {
		module.exports = fn();
	} else if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], fn);
	} else {
		fn();
	}
}(function() {
	var $ = window.jQuery;
	$.fn.extend({
		/*
			检查表单是否全空
			
			返回格式
			{isEmpty: false|true}
		*/
		checkFormIsEmpty: function() {
			var result = true;
			this.find('input, textarea,select').each(function(index, element) {
				var $element = $(element);
				if ($element.val()) {
					result = false;
					return false;
				}
			});
			return {
				isEmpty: result
			};
		},
		/*
			检查表单 
			data-null=false  表示不能为空
			与之对应的提示信息是data-msg

			data-reg 表示检验的正则表达式
			与之对应的提示信息为data-regMsg

			返回格式为
			{success: false|true, msg: ''}
		*/

		checkNullInput: function(dataName, needName) {
			var dataName = dataName || '[data-null=false]',
				needName = needName || '[data-need="false"]',
				result = {
					success: true,
					msg: ''
				};

			var needCheckInput = this.find('input, textarea, select').not(needName).not(':hidden').filter(dataName);

			needCheckInput.each(function(index, element) {
				var $element = $(element),
					val = $.trim($element.val()),
					msg = $element.attr('data-msg') || '必填项不能为空',
					reg = $element.attr('data-reg'),
					regMsg = $element.attr('data-regMsg') || '必填项不能为空';
				if (!val || val.length === 0) {
					result = {
						success: false,
						msg: msg
					};
					return false;
				} else {
					if (reg && !new RegExp(reg).test(val)) {
						result = {
							success: false,
							msg: regMsg
						};
						return false;
					}
				}
			});
			return result;
		},

		/*
			获取正常表单值 
			data-name表示存储的对象的key

			返回格式为
			{
				name:'',
				sex:''
				checkbox: []
			}
		*/

		getFormValue: function(dataName, needName, needEncode) {
			var dataName = dataName || 'name',
				needName = needName || '[data-need="false"]',
				resultObj = {};

			this.find('input, textarea, select, span[data-name], a[data-name]').not(needName).not(':hidden').each(function(index, element) {
				var $element = $(element),
					key = $(element).attr(dataName) || $(element).attr('data-name'),
					type = $(element).attr('type'),
					tagName = element.tagName.toUpperCase();

				if (tagName === 'INPUT') {
					switch (type) {
						case 'hidden':
						case 'password':
						case 'text':
							resultObj[key] = needEncode ? htmlEncode($.trim($element.val())) : $.trim($element.val());
							break;
						case 'radio':
							if ($element.is(':checked')) {
								resultObj[key] = $.trim($element.val());
							}
							break;
						case 'checkbox':
							if ($element.is(':checked')) {
								resultObj[key] = resultObj[key] || [];
								resultObj[key].push($.trim($element.val()));
							}
							break;
						default:
							break;
					}
				}

				if (tagName === 'SELECT' || tagName === 'TEXTAREA') {
					resultObj[key] = needEncode ? htmlEncode($.trim($element.val())) : $.trim($element.val());
				}
				if (tagName === 'SPAN' || tagName === 'A') {
					console.log($element.hasClass('form-radio') && $element.hasClass('checked'))
					if ($element.hasClass('formCheckbox')) {
						resultObj[key] = resultObj[key] || [];
						resultObj[key].push($element.attr('data-value'));
					} else if ($element.hasClass('form-radio')) {
						if ($element.hasClass('checked')) {
							resultObj[key] = $element.attr('data-value');
						}
					} else {
						resultObj[key] = $element.attr('data-value');
					}
				}
			});
			return resultObj;
		},

		/*
			兼容ie8以下placeholder
		*/

		initPlaceHolder: function(opts) {
			var defaults = {
				leftDistance: 10,
				topDistance: 0
			};

			defaults = $.extend(true, {}, defaults, opts || {});
			if (!('placeholder' in document.createElement('input'))) {
				this.find('input, textarea').each(function(index, element) {
					var $el = $(element),
						placeholder = $el.attr('placeholder'),
						_resetPlaceholder = null,
						$span, elId;

					if (placeholder) {
						elId = $el.attr('id');
						elName = $el.attr('name');
						if (!elId) {
							elId = 'placeholder' + new Date().getTime() + (Math.random() * 10000).toFixed();
							$el.attr('id', elId);
						}
						$span = $('<label for="' + elName + '">', {
							html: $el.val() ? '' : placeholder,
							css: {
								position: 'absolute',
								left: $el.position().left + defaults.leftDistance,
								top: $el.position().top + defaults.topDistance,
								color: '#C3C3C3',
								cursor: 'text',
								fontSize: '14px'
							}
						}).insertAfter($el);

						_resetPlaceholder = function() {
							if ($el.val()) {
								$span.html('');
							} else {
								$span.html(placeholder);
							}
						};

						$el.on('focus blur input keyup propertychange', _resetPlaceholder);
					}

				})
			}
		},

		/*
		 
		 	限制输入长度
		 */

		limitInputNum: function(opts) {
			var defaultOpts = {
				limitSign: 'data-numLimit'
			};

			var opts = $.extend(true, {}, defaultOpts, opts || {});

			if (!('maxLength' in document.createElement('input'))) {
				this.find('input[' + opts.limitSign + '], textarea[' + opts.limitSign + ']').each(function(index, item) {
					var $item = $(item),
						num = $item.attr(opts.limitSign);
					$item.on('input', function() {
						if ($(this).length >= num) {
							return false;
						}
					});
				})
			}
		},

		/*
			获取适合当前checkbox的获值方法
		*/

		getCheckboxVal: function(className, dataName, valueName) {
			var className = className || 'form-checkbox',
				dataName = dataName || 'data-name',
				valueName = valueName || 'data-value',
				result = {};

			this.find('.' + className).each(function(index, element) {
				var $ele = $(element),
					key = $ele.attr(dataName);

				if ($ele.hasClass('checked')) {
					result[key] = result[key] || [];
					result[key].push($ele.attr(valueName));
				}
			});

			for (var key in result) {
				result[key] = result[key].join(',');
			}

			return result;
		},

		/*
			清空当前样式的checkbox
		*/

		clearCheckBox: function(className) {
			var className = className || 'form-checkbox';

			this.find('.' + className).removeClass('checked');
		},

		resetUploadForm: function(dataName) {
			var dataName = dataName || '.img-item';

			this.find(dataName).remove();
		}

	});

	$.extend({
		setFormValue: function(formValue, keyAttribute) {
			var keyAttribute = keyAttribute || 'name';

			for (var key in formValue) {
				var $dom = $('[' + keyAttribute + '=' + key + ']');
				$dom.val(formValue[key]);
			}
		}
	});
}));