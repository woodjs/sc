define(function() {

	var timeout;

	var util = {
		isNotEmpty: function(str) {
			return !this.isEmpty(str);
		},
		isEmpty: function(str) {
			if (!str || /^\s*$/.test(str))
				return true;
			return false;
		},
		isInteger: function(val) {
			return /^[1-9]*[1-9][0-9]*$/.test(val);
		},
		isNumber: function(str) {
			return /^\d+$/.test(str);
		},
		isLegalPassword: function(str) {
			return /^[0-9a-zA-Z]{6,18}$/.test(str);
		},
		isJsonString: function(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		prompt: function(msg, type) {
			clearTimeout(timeout);
			$('#tip-message').attr('class', type).text(msg).show();
			timeout = setTimeout(function() {
				$('#tip-message').fadeOut();
			}, 3000);
		},
		promptWithPosition: function(msg, type, top, left) {
			clearTimeout(timeout);
			$('#tip-message').attr('class', type).css('top', top).css('left', left).text(msg).show();
			timeout = setTimeout(function() {
				$('#tip-message').fadeOut();
			}, 30000);
		},
		dateFormat: function(date) {
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		},
		getElemCenterTL: function getElemCenterTL(_w, _h) {
			var win_w = $(window).outerWidth();
			var win_h = $(window).outerHeight();
			var top = (win_h - _h) / 2;
			var left = (win_w - _w) / 2;
			return {
				t: top,
				l: left
			};
		},
		getUrlParams: function(name) {
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.search);
			if (results == null)
				return "";
			else
				return decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		getHash: function() {
			var hash = (window.location.hash || '').replace(/^#/, '').split('&'),
				parsed = {};

			for (var i = 0, el; i < hash.length; i++) {
				var el = hash[i].split('=')
				parsed[el[0]] = el[1];
			}

			return parsed;
		}
	};
	return util;
});