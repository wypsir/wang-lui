layui.config({
    base: 'js/'
});
var tab;
layui.use(['element', 'navbar', 'tab', 'common'], function () {
    var $ = layui.jquery
        , element = layui.element,
        common = layui.common,
        navbar = layui.navbar,
        layer = layui.layer;
    tab = layui.tab({
        elem: '.admin-nav-card',
        contextMenu: true,
    });


    navbar.set({
        elem: '#admin-navbar-side',
        data: navs,
        // url:'datas/nav.json'
    })
    console.log(navs)
    navbar.render();
    navbar.on('click(side)', function (data) {
        var othis = $(this);
        console.log("nav click", data)
        tab.tabAdd(data.field);
    })
    navbar.on('click(setting)', function (data) {
        var othis = $(this);
        console.log("setting click", data)
        tab.tabAdd(data.field);
    })

    //iframe自适应
    $(window).on('resize', function () {
        var $content = $('.admin-nav-card .layui-tab-content');
        $content.height($(this).height() - 147);
        $content.find('iframe').each(function () {
            $(this).height($content.height());
        });
    }).resize();

    // tab.reload();

    var active = {
        notice: function () {
            //示范一个公告层
            layer.open({
                type: 1
                ,
                title: false //不显示标题栏
                ,
                closeBtn: false
                ,
                area: '300px;'
                ,
                shade: 0.8
                ,
                id: 'LAY_layuipro' //设定一个id，防止重复弹出
                ,
                btn: ['火速围观', '残忍拒绝']
                ,
                btnAlign: 'c'
                ,
                moveType: 1 //拖拽模式，0或者1
                ,
                content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">你知道吗？亲！<br>layer ≠ layui<br><br>layer只是作为Layui的一个弹层模块，由于其用户基数较大，所以常常会有人以为layui是layerui<br><br>layer虽然已被 Layui 收编为内置的弹层模块，但仍然会作为一个独立组件全力维护、升级。<br><br>我们此后的征途是星辰大海 ^_^</div>'
                ,
                success: function (layero) {
                    var btn = layero.find('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').attr({
                        href: 'http://www.layui.com/'
                        , target: '_blank'
                    });
                }
            });
        }, setting: function () {
            //示范一个公告层
            layer.open({
                type: 1
                ,
                title: false //不显示标题栏
                ,
                closeBtn: false
                ,
                area: '300px;'
                ,
                shade: 0.8
                ,
                id: 'setting' //设定一个id，防止重复弹出
                ,
                btn: ['火速围观', '残忍拒绝']
                ,
                btnAlign: 'c'
                ,
                moveType: 1 //拖拽模式，0或者1
                ,
                content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">你知道吗？亲！<br>layer ≠ layui<br><br>layer只是作为Layui的一个弹层模块，由于其用户基数较大，所以常常会有人以为layui是layerui<br><br>layer虽然已被 Layui 收编为内置的弹层模块，但仍然会作为一个独立组件全力维护、升级。<br><br>我们此后的征途是星辰大海 ^_^</div>'
                ,
                success: function (layero) {
                    var btn = layero.find('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').attr({
                        href: 'http://www.layui.com/'
                        , target: '_blank'
                    });
                }
            });
        }, layout: function () {
            //示范一个公告层
            layer.confirm( '确定要注销系统吗？', {icon: 2, title: '系统提示'}, function (index) {
                    layer.msg("正在注销系统...")
                    layer.close(index);

                }
            );
        },
    }

    $('#side-right a').on('click', function () {
        var that = $(this), method = that.data('method');
        console.log(that)
        console.log(method)
            active[method] ? active[method].call(this, that) : '';
    })

    // $(".layout").on('click', function () {
    //     active.layout();
    // })
});