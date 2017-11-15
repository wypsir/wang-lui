/**
 * 扩展一个tab模块
 */
var tabs = [], currentTab = {};
layui.define(['element', 'jquery', 'common'], function (exports) {
    var model_name = 'tab',
        $ = layui.jquery,
        element = layui.element,
        layer = layui.layer,
        common = layui.common;
    var ELEM = {},
        globalTabIdIndex = 0;
    var Tab = function () {
        this.config = {
            elem: undefined,
            closed: true,
            autoRefresh: false,
            contextMenu: false,
            onSwitch: undefined,
            openWait: false,
            cache: true
        }
    }

    /**
     * 设置参数
     * @param options
     * @returns {Tab}
     */
    Tab.prototype.set = function (options) {
        $.extend(true, this.config, options);
        return this;
    }

    Tab.prototype.init = function () {
        var elem = this;
        console.log("tab init...", elem)
        var _config = elem.config;
        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
            common.throwError("tab elem参数未定义或设置错误！")
        }
        var context;
        if (typeof (_config.elem) === 'string') {
            context = $('' + _config.elem + '')
        }
        if (typeof (_config.elem) === 'object') {
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
        ELEM.titleBox = context.children('ul.layui-tab-title');
        ELEM.contentBox = context.children('div.layui-tab-content');
        ELEM.tabFilter = filter;

        return elem;
    }
    /**
     * 重新加载
     */
    Tab.prototype.reload = function () {

        if (window.sessionStorage.getItem("tabs") !== null) {
            var that = ELEM.tabFilter === undefined ? this.init() : this;
            tabs = JSON.parse(window.sessionStorage.getItem("tabs"));
            currentTab = JSON.parse(window.sessionStorage.getItem("currentTab"));
            for (var i = 0; i < tabs.length; i++) {
                var title = "";
                if (tabs[i].icon) {
                    title += '<i class="layui-icon">' + tabs[i].icon + '</i>'
                }
                title += '<cite>' + tabs[i].title + '</cite>';
                var content = '<iframe src="' + tabs[i].href + '" data-id="' + tabs[i].layId + '"></iframe>'

                title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + tabs[i].layId + '">&#x1006;</i>';
                element.tabAdd(ELEM.tabFilter, {
                    title: title,
                    content: content,
                    id: tabs[i].layId
                })
                //iframe 自适应
                ELEM.contentBox.find('iframe[data-id=' + tabs[i].layId + ']').each(function () {
                    $(this).height(ELEM.contentBox.height());
                });
                ELEM.titleBox.find('li').children('i.layui-tab-close[data-id=' + tabs[i].layId + ']')
                    .on('click', function () {
                        var index = $(this).parent('li').index();
                        tabs.splice((index - 1), 1);
                        if (tabs[tabs.length - 1]) {
                            window.sessionStorage.setItem("currentTab", JSON.stringify(tabs[tabs.length - 1]));
                        } else {
                            common.data('currentTab', null)
                        }
                        window.sessionStorage.setItem("tabs", JSON.stringify(tabs));
                        element.tabDelete(ELEM.tabFilter, $(this).parent('li').attr('lay-id')).init();
                    })
                if (currentTab == null) {
                    element.tabChange(ELEM.tabFilter, null);
                } else if (currentTab.title == tabs[i].title) {
                    element.tabChange(ELEM.tabFilter, tabs[i].layId);
                } else {
                    console.log("currentTab else")
                }
            }
        }
    }


    /**
     * 获取当前tab 的tabId
     * @returns {*}
     */
    Tab.prototype.getCurrentTabId = function () {
        var _config = this.config;
        return $(_config.elem).find('ui.layui-tab-title').children('li.layui-this').attr('lay-id');
    }
    Tab.prototype.exists = function (title) {
        var that = ELEM.titleBox === undefined ? this.init() : this, tabIndex = -1;
        console.log(ELEM)
        ELEM.titleBox.find("li").each(function (i) {
            var cite = $(this).children('cite');
            if (cite.text() === title) {
                tabIndex = i;
            }
        })
        return tabIndex;
    }

    Tab.prototype.getTabId = function (title) {
        var that = ELEM.titleBox === undefined ? this.init() : this, tabId = -1;
        var length = ELEM.titleBox.find("li").length;
        console.log('getTabId:', length)
        ELEM.titleBox.find("li").each(function (i) {
            var cite = $(this).children('cite');
            if (cite.text() === title) {
                tabId = $(this).attr('lay-id');
            }
        })
        return tabId;
    }

    Tab.prototype.initTabContextMenu = function () {
        ELEM.titleBox.find('li').on('contextmenu', function (e) {
            var target = $(e.target);
            e.preventDefault();
            e.stopPropagation();
            console.log("target:", target)
            var div = document.createElement('dev');
            var ul = '<ul>'
            ul += '<li data-target="refresh" title="刷新当前选项"><i></i>刷新</li>';
            ul += '<li data-target="closeCurrent" title="关闭当前选项"><i></i>关闭</li>';
            ul += '<li data-target="closeOther" title="关闭其他选项"><i></i>关闭其他</li>';
            ul += '<li data-target="closeAll" title="关闭所有选项"><i></i>关闭所有</li>';
            ul += '<li data-target="closeRight" title="关闭当前右边选项"><i></i>关闭右边</li>';
            ul += '<li data-target="closeLeft" title="关闭当前左边选项"><i></i>关闭左边</li>';
            ul += '</ul>';
            div.innerHTML = ul;
            div.style.top = e.pageY + 'px';
            div.style.left = e.pageX + 'px';
            document.getElementsByTagName('body')[0].appendChild(div);
        });
    }

    Tab.prototype.tabAdd = function (data) {
        var that = this;
        var _config = this.config;
        var tabIndex = that.exists(data.title);
        console.log("tabs:", tabs)
        if (window.sessionStorage.getItem("tabs")) {
            tabs = JSON.parse(window.sessionStorage.getItem("tabs"));
        }
        var waitLoadIndex;
        if (tabIndex === -1) { //当tab列表中不存在当前tab时 追加
            if (_config.openWait) {
                waitLoadIndex = layer.load(2);
            }
            globalTabIdIndex++;
            var content = '<iframe src="' + data.href + '" data-id="' + globalTabIdIndex + '"></iframe>'
            var title = "";
            if (data.icon != undefined && data.icon !== '') {
                title += '<i class="layui-icon">' + data.icon + '</i>'
            }
            title += '<cite>' + data.title + '</cite>';
            if (_config.closed) {
                title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + globalTabIdIndex + '">&#x1006;</i>';
            }
            var tabId = new Date().getTime();
            element.tabAdd(ELEM.tabFilter, {
                title: title,
                content: content,
                id: tabId
            })
            currentTab = {icon: data.icon, title: data.title, href: data.href, layId: new Date().getTime()};
            tabs.push(currentTab);
            //iframe 自适应
            ELEM.contentBox.find('iframe[data-id=' + globalTabIdIndex + ']').each(function () {
                $(this).height(ELEM.contentBox.height());
            });
            if (_config.closed) {
                ELEM.titleBox.find('li').children('i.layui-tab-close[data-id=' + globalTabIdIndex + ']')
                    .on('click', function () {
                        var index = $(this).parent('li').index();
                        tabs.splice((index - 1), 1);
                        if (tabs[tabs.length - 1]) {
                            window.sessionStorage.setItem("currentTab", JSON.stringify(tabs[tabs.length - 1]));
                        } else {
                            common.data('currentTab', null)
                        }
                        window.sessionStorage.setItem("tabs", JSON.stringify(tabs));
                        element.tabDelete(ELEM.tabFilter, $(this).parent('li').attr('lay-id')).init();
                    })
            }
            if (_config.cache) {
                /** 缓存tab*/
                window.sessionStorage.setItem("currentTab", JSON.stringify(currentTab));
                window.sessionStorage.setItem("tabs", JSON.stringify(tabs))
            }
            element.tabChange(ELEM.tabFilter, that.getTabId(data.title))
        } else {
            element.tabChange(ELEM.tabFilter, that.getTabId(data.title));
            currentTab = {icon: data.icon, title: data.title, href: data.href, layId: new Date().getTime()}
            if (_config.cache) {
                /** 缓存tab*/
                window.sessionStorage.setItem("currentTab", JSON.stringify(currentTab));
            }
            //自动刷新
            if (_config.autoRefresh) {
                _config.elem.find('div.layui-tab-content > div').eq(tabIndex).children('iframe')[0].contentWindow.location.reload();
            }
        }

        if (_config.contextMenu) {
            !ELEM.titleBox.find('li').not(':first').on('contextmenu', function (e) {
                var target = $(e.target);
                e.preventDefault();
                // e.stopPropagation();
                console.log("target:", target)
                var contextMenu = $(document).find('div.admin-contextmenu');
                if (contextMenu.length < 1) {
                    contextMenu = that.genContextMenu(e);
                } else {
                    contextMenu.css('top', (e.pageY - 5) + 'px');
                    contextMenu.css('left', e.pageX + 'px');
                }
                $(document).find('div.admin-contextmenu').show();
                $(document).find('div.admin-contextmenu').mouseleave(function () {
                    $(this).hide();
                })
                var id = $(this).find('i.layui-tab-close').data('id');
                var clickIndex = $(this).attr('lay-id');
                $(document).find('div.admin-contextmenu').children('ul').find('li').each(function () {
                    var that = $(this);
                    that.on('click', function () {
                        var target = that.data('target');
                        switch (target) {
                            case 'refresh':
                                var src = ELEM.contentBox.find('iframe[data-id=' + id + ']')[0].src;
                                console.log("refresh:", ELEM.contentBox.find('iframe[data-id=' + id + ']'))
                                ELEM.contentBox.find('iframe[data-id=' + id + ']')[0].src = src;
                                break;
                            case 'close-current':
                                if (clickIndex > 0) {
                                    element.tabDelete(ELEM.tabFilter, clickIndex)
                                }
                                break;
                            case 'close-other':
                                ELEM.titleBox.children('li').each(function () {
                                    var that = $(this);
                                    var currentId = $(this).find('i.layui-tab-close').data('id');

                                    if (currentId !== undefined && currentId != id) {
                                        element.tabDelete(ELEM.tabFilter, that.attr('lay-id'))
                                    }
                                })

                                break;
                            case 'close-all':
                                ELEM.titleBox.children('li').each(function () {
                                    var that = $(this);
                                    if (that.index() !== 0) {
                                        element.tabDelete(ELEM.tabFilter, that.attr('lay-id'))
                                    }
                                })
                                break;
                            case 'close-right-all':

                                break;
                            case 'close-left-all':

                                break;
                            default :

                                break
                        }
                        $(document).find('div.admin-contextmenu').remove();
                    })
                })

            });
        }
    }


    /**
     * 删除tab
     * @param id
     * @returns {Tab}
     */
    Tab.prototype.tabDelete = function (id) {
        element.tabDelete(ELEM.tabFilter, id);
        return this;
    }

    Tab.prototype.genContextMenu = function (e) {
        var div = document.createElement('div');
        div.style.width = '130px';
        div.className = 'admin-contextmenu';
        div.style.backgroundColor = 'white';
        var ul = '<ul>'
        ul += '<li data-target="refresh" title="刷新当前选项"><i></i>刷新</li>';
        ul += '<li data-target="close-current" title="关闭当前选项"><i></i>关闭</li>';
        ul += '<li data-target="close-other" title="关闭其他选项"><i></i>关闭其他</li>';
        ul += '<li data-target="close-all" title="关闭所有选项"><i></i>关闭所有</li>';
        ul += '<li data-target="close-right-all" title="关闭当前右边选项"><i></i>关闭右边</li>';
        ul += '<li data-target="close-left-all" title="关闭当前左边选项"><i></i>关闭左边</li>';
        ul += '</ul>';
        div.innerHTML = ul;
        div.style.top = e.pageY + 'px';
        div.style.left = e.pageX + 'px';
        return document.getElementsByTagName('body')[0].appendChild(div);
    }

    var tab = new Tab();

    //输出test接口
    exports(model_name, function (options) {
        return tab.set(options);
    });
})