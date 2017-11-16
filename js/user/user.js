/**
 * 用户中心模块
 */
layui.use(['form', 'element','table'], function () {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        element = layui.element;

//执行一个 table 实例
    table.render({
        elem: '#user'
        , height: 332
        , url: '../../datas/user.json' //数据接口
        , page: true //开启分页
        , cols: [[ //表头
            {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'}
            , {field: 'username', title: '用户名', width: 80}
            , {field: 'sex', title: '性别', width: 80, sort: true}
            , {field: 'city', title: '城市', width: 80}
            , {field: 'sign', title: '签名', width: 177}
            , {field: 'experience', title: '积分', width: 80, sort: true}
            , {field: 'score', title: '评分', width: 80, sort: true}
            , {field: 'classify', title: '职业', width: 80}
            , {field: 'wealth', title: '财富', width: 135, sort: true}
            , {fixed: 'right', width: 175, align: 'center', toolbar: '#barDemo'}
        ]]
    });



})