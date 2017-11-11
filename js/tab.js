/**
 * 扩展一个tab模块
 */
layui.define(['element', 'jquery','common'], function (exports) {
    var model_name = 'tab',
        $ = layui.jquery,
        element = layui.element,
        layer = layui.layer,
        common = layui.common;
        ELEM = {},
        tab = function () {
            this.config = {
                elem: undefined,
                closed: true,
                autoRefresh: false,
                contextMenu: false,
                onSwitch: undefined,
                openWait: false
            }
        }

    /**
     * 设置参数
     * @param options
     * @returns {tab}
     */
    tab.prototype.set = function (options) {
        $.extend(true, this.config, options);
        return this;
    }

    tab.prototype.init = function () {
        var elem = this;
        console.log("tab init...", elem)
        var _config = elem.config;
        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
            common.throwError("tab elem参数未定义或设置错误！")
        }
        var context;
        if (typeof (_config.elem) !== 'string') {
            context = $(''+_config.elem+'')
        }
        if (typeof (_config.elem) !== 'object') {
            context = _config.elem;
        }
        if (context.length === 0) {
            common.throwError("tab error:elem 参数配置错误！")
        }
        var filter = context.attr('lay-filter');
        if (filter === undefined || filter === '') {
            common.throwError('tab error:请为elem容器设置一个lay-filter过滤器');
        }
        _config.elem = context;
        ELEM.titleBox = context.children('ui.layui-tab-title');
        ELEM.contentBox = context.children('div.layui-tab-content');
        ELEM.tabFilter = filter;
        return elem;
    }


    /**
     * 获取当前tab 的tabId
     * @returns {*}
     */
    tab.prototype.getCurrentTabId = function () {
        var _config = this.config;
        return $(_config.elem).find('ui.layui-tab-title').children('li.layui-this').attr('lay-id');
    }



    /**
     * 删除tab
     * @param id
     * @returns {tab}
     */
    tab.prototype.tabDelete = function (id) {
        element.tabDelete(ELEM.tabFilter, id);
        return this;
    }

    //输出test接口
    exports(model_name, function (options) {
        return tab.set(options);
    });
})