define(["globalConfig", "jquery", 'json2'], function(settings) {
    var ACTIONS = {
            "search": "搜索",
            "expand": "展开",
            "collapse": "收缩",
            "add": "添加",
            "view": "查看",
            "paging": "翻页",
            "delete": "删除",
            "create": "生成",
            "open": "弹出",
            "export": "导出",
            "print": "打印",
            "prev": "向上",
            "next": "向下",
            "zoomin": "放大",
            "zoomout": "缩小",
            "rotate": "旋转",
            "reset": "还原",
            "link": "跳转",
            "submit": "提交"
        },
        localUrl = window.location.href,
        url = settings.context.trackUrl,
        lang = settings.context.currentLang,
        appCode = settings.context.appCode,
        userCode = settings.context.userCode,
        trackEnable = settings.context.trackEnabled;

    var track = {

        init: function() {
            var self = this;

            self.initEvents();
        },

        initEvents: function() {
            var self = this;

            $("a[data-track]").on('click', function(e) {
                var track = $(this).attr('data-track'),
                    href = $(this).attr('href'),
                    track = JSON.parse(track),
                    x = e.clientX,
                    y = e.clientY;

                self.publish(track.categoryId, track.target, 'link', x, y, href);
            });
        },

        publish: function(categoryId, target, action, x, y, value) {
            var self = this;

            var params = {
                app: appCode,
                uid: userCode,
                url: localUrl,
                cateId: categoryId,
                target: target,
                action: ACTIONS[action],
                param: ($.type(value) == "object" || $.type(value) == "array" ? JSON.stringify(value) : value),
                x: x,
                y: y,
                lng: lang
            };
            if (Boolean(trackEnable)) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    jsonp: '_cb',
                    jsonpCallback: '_scb',
                    data: params
                });
            }
        }
    };

    track.init();

    return {
        publish: function(categoryId, target, action, x, y, value) {
            track.publish(categoryId, target, action, x, y, value);
        }
    };
});