/**
 * 左侧导航
 */
layui.define(['element', 'common'], function (exports) {
    var $ = layui.$,
        layer = layui.layer,
        element = layui.element,
        common = layui.common,
        MOD_NAME = "navbar",
        CACHE_NAME = "ui:navbar",
        Navbar = function () {
            this.config = {
                elem: undefined,
                data: undefined,
                url: undefined,
                type: 'GET',
                cached: false,
                spreadOne: false
            };
        }

    Navbar.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    }


    Navbar.prototype.init = function (type, filter) {
        var that = this,
            _config = that.config,
            items = {
                nav: function () {
                    console.log("render NavBar  .....")

                    var $container;
                    if (typeof (_config.elem) === 'string') {
                        $container = $('' + _config.elem + '');
                    }
                    if (typeof (_config.elem) === 'object') {
                        $container = _config.elem;
                    }
                    // if (_config.data !== 'string' && typeof _config.data !== 'object') {
                    //     common.throwError('Navbar error: navbar参数未定义或设置出错，具体设置格式请参考文档API.');
                    // }
                    if (_config.data !== undefined && typeof _config.data === 'object') {
                        var html = call.genHtml(_config.data);
                        $container.html(html);
                        that.config.elem = $container;
                        element.init();
                    } else {
                        if (_config.cached) {
                            var data = layui.data(CACHE_NAME);
                            console.log("cached:", data)
                            if (data.navbar === undefined) {
                                $.ajax({
                                    type: _config.type,
                                    url: _config.url,
                                    async: false,
                                    dataType: 'json',
                                    success: function (res, status, xhr) {
                                        layui.data(CACHE_NAME, {key: 'navbar', value: res})
                                        var html = call.genHtml(res);
                                        $container.html(html);
                                        element.init();
                                    },
                                    error: function (error) {
                                        common.msgError('ajax load navbar error:' + error)
                                    },
                                    complete: function (xhr, status) {
                                        that.config.elem = $container;
                                    }
                                })
                            }
                            else {
                                var html = call.genHtml(cacheNavbar.navbar);
                                $container.html(html);
                                element.init();
                                that.config.elem = $container;
                            }
                        } else {
                            //清空缓存
                            layui.data(CACHE_NAME, null);
                            $.ajax({
                                type: _config.type,
                                url: _config.url,
                                async: false, //_config.async,
                                dataType: 'json',
                                success: function (result, status, xhr) {
                                    var html = call.genHtml(res);
                                    $container.html(html);
                                    element.init();
                                },
                                error: function (xhr, status, error) {
                                    common.msgError('ajax load navbar error:' + error)
                                },
                                complete: function (xhr, status) {
                                    that.config.elem = $container;
                                }
                            });
                        }
                    }

                    return that;
                },
                tab: function () {

                }
            }
        return items[type] ? items[type]() : layui.each(items, function (index, item) {
            item();
        });
    }

    var call = {
        genHtml: function (data) {

            var ulHtml = '<ul class="layui-nav layui-nav-tree beg-navbar">';
            for (var i = 0; i < data.length; i++) {
                /**
                 * 是否展开菜单
                 */
                if (data[i].spread) {
                    ulHtml += '<li class="layui-nav-item layui-nav-itemed">'
                } else {
                    ulHtml += '<li class="layui-nav-item">';
                }
                var children = data[i].children;
                var title = data[i].title;
                var icon = data[i].icon;
                if (children !== undefined && children !== null && children.length > 0) {
                    /**
                     * 处理子菜单
                     */
                    ulHtml += '<a class="" href="javascript:;">';
                    if (icon !== undefined && icon !== "") {
                        ulHtml += '<i class="layui-icon" data-icon="' + icon + '">' + icon + '</i>'
                    }
                    ulHtml += '<cite>' + title + '</cite>'
                    ulHtml += '</a>';
                    ulHtml += '<dl class="layui-nav-child">';
                    for (var j = 0; j < children.length; j++) {
                        var href = children[j].href;
                        icon = children[j].icon;
                        title = children[j].title;
                        var dataUrl = (href !== undefined && href !== '') ? 'data-url="' + href + '"' : '';
                        ulHtml += '<dd><a href="javascript:;"' + dataUrl + '>';
                        if (icon !== undefined && icon !== "") {
                            ulHtml += '<i class="layui-icon" data-icon="' + icon + '">' + icon + '</i>'
                        }
                        ulHtml += '<cite>' + title + '</cite>'
                        ulHtml += '</a></dd>';
                    }
                    ulHtml += '</dl>';
                } else {


                    var href = data[i].href;
                    var dataUrl = (href !== undefined && href !== '') ? 'data-url="' + href + '"' : '';
                    ulHtml += '<a href="javascript:;"' + dataUrl + '>';
                    if (icon !== undefined && icon !== "") {
                        ulHtml += '<i class="layui-icon" data-icon="' + icon + '">' + icon + '</i>'
                    }
                    ulHtml += '<cite>' + title + '</cite>'
                    ulHtml += '</a>'
                }
                ulHtml += '</li>';
            }
            ulHtml += '</ul>';
            return ulHtml;
        }
    }


    var navbar = new Navbar();

    Navbar.prototype.render = Navbar.prototype.init;
    Navbar.prototype.on = function (events, callback) {
        var that = this;
        var elem = that.config.elem;
        if (typeof (events) !== 'string') {
            common.throwError("事件配置错误")
        }
        var index_1 = events.indexOf("(");
        var index_2 = events.indexOf(")");
        var eventName = events.substr(0, index_1);
        var lay_filter = events.substring(index_1 + 1, index_2);
        var call = {
            click: function (obj) {
                obj.on('click', function () {
                    var othis = $(this);
                    var elem = othis.children('a');
                    var href = elem.data('url');
                    var icon = elem.children('i:first').data('icon');
                    var title = elem.children('cite').text();
                    var data = {elem: elem, field: {href: href, icon: icon, title: title}};
                    callback(data);
                })
            }
        }
        if (eventName === 'click') {
            if (elem.attr('lay-filter') !== undefined) {
                elem.children('ul').find('li').each(function (i, e) {
                    var othis = $(this);
                    if (othis.find('dl').length > 0) {
                        othis.find('dd').each(function () {
                            call.click($(this));
                        })
                    } else {
                        call.click(othis)
                    }
                })
            }
        }

    }


    exports(MOD_NAME, navbar);
})