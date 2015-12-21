$(function () {
    var $menu = $("#tree-menu");
    var $mainWrap = $("#main-wrap");
    var $navigation = $("#navigation");
    var $iframe = $("#manual-content");
    var template = '{{#list}}<li><label>{{name}}</label><b data-event-id="close" data-id="{{id}}" >×</b></li>{{/list}}';

    var manual = {

        init: function () {
            var self = this;

            
            self.resize();
            self.bindEvent();
            self.getData();
        },

        bindEvent: function () {
            var self = this;

            $navigation.on("click", "b[data-event-id='close']", function () {
                self.closeNavigation(this);
            });
        },

        getData: function () {
            var self = this;

            $.getJSON('data/menu.json', function (data) {
                self.renderTree(data);
            });
        },

        renderTree: function (data) {
            var self = this;
            var setting = { callback: { onClick: $.proxy(self.selectedNode, self) }};

            self.zTree = $.fn.zTree.init($menu, setting, data);
        },

        selectedNode: function (event, treeId, treeNode) {
            var self = this;
            self.addNavigation(treeNode);
            if ($.trim(treeNode.menu_url).length > 0) $iframe.attr("src", treeNode.menu_url);
            else $iframe.attr("src", "");
        },

        addNavigation: function (treeNode) {
            var self = this;
            var data = [];
            data.push({'id':treeNode.id, 'name': treeNode.name });
            treeNode = treeNode.getParentNode();

            while (treeNode) {
                data.push({ 'id': treeNode.id, 'name': treeNode.name });
                treeNode = treeNode.getParentNode();
            }

            var output = Mustache.render(template, { list: data.reverse() });
            $navigation.html(output);
        },

        closeNavigation: function (closeNode) {
            var self = this;
            var $closeNode = $(closeNode);
            var id = $closeNode.attr("data-id");
            var nodeList = self.zTree.getNodesByParam("id", id);

            if (nodeList.length > 0) {
                self.zTree.cancelSelectedNode();
                self.zTree.expandNode(nodeList[0], false, null, null);
            }

            $closeNode.parent().nextAll().remove("li");
            $closeNode.parent().remove("li");
            $iframe.attr("src", "");
        },

        resize: function () {
            var self = this;
            var winHeight = $(window).height() - $menu.offset().top;

            $mainWrap.height(winHeight);
        }

    };

    manual.init();
    

    window.onresize = function () { manual.resize(); };
});
