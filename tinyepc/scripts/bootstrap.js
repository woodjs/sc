var loadScriptPaths = {
	search: {
		development: ['search/main.js'],
		release: ['search.min.js']
	},
	usage: {
		development: ['usage/main.js'],
		release: ['usage.min.js']
	},
	detail: {
		development: ['detail/main.js'],
		release: ['detail.min.js']
	},
	detail_notFount: {
		development: ['detail/info.js'],
		release: ['detail_notFount.min.js']
	},
	vin: {
		development: ['vin/main.js'],
		release: ['vin.min.js']
	},
	home: {
		development: ['home/main.js'],
		release: ['home.min.js']
	},
	login: {
		development: ['login/main.js'],
		release: ['login.min.js']
	},
	cart: {
		development: ['cart/main.js'],
		release: ['cart.min.js']
	},
	order_list: {
		development: ['order/list.js'],
		release: ['order_list.min.js']
	},
	order_detail: {
		development: ['order/detail.js'],
		release: ['order_detail.min.js']
	},
	user: {
		development: ['user/main.js'],
		release: ['user.min.js']
	}
};

(function() {
	var pageConfig = globalConfig.pageConfig,
		requireConfig = require.s.contexts._.config,
		loadModule = loadScriptPaths[pageConfig.pageCode],
		loadScriptSrc, baseUrl = requireConfig.baseUrl;

	var buildUrl = function(paths) {
		for (var i = 0; i < paths.length; i++) {
			if (globalConfig.isLocal) {
				paths[i] = baseUrl + 'app/' + paths[i];
			} else {
				paths[i] = pageConfig.releaseScripts + paths[i] + "?v=" + pageConfig.releaseVersion;
			}
		}
		return paths;
	};

	if (globalConfig.isLocal) {
		if (!loadModule) {
			return;
		}
		loadScriptSrc = buildUrl(loadModule.development)
		require(loadScriptSrc);
	} else {
		if (!loadModule) {
			return;
		}
		loadScriptSrc = buildUrl(loadModule.release);
		require(["jquery"], function() {
			require(loadScriptSrc);
		});
	}
})();