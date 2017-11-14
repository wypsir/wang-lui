layui.config({
    base: 'js/'
});
var tab;
layui.use(['element','navbar','tab'],function(){
	var $ = layui.jquery
	,element = layui.element,
        navbar = layui.navbar;
        tab = layui.tab({
            elem:'.admin-nav-card'
        });


    navbar.set({
		elem:'#admin-navbar-side',
		data:navs,
        // url:'datas/nav.json'
	})
    navbar.render();
    navbar.on('click(side)',function (data) {
        var othis = $(this);
        console.log("nav click",data)
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

    tab.reload();
});