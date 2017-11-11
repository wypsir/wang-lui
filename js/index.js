layui.use(['element'],function(){
	var $ = layui.jquery
	,element = layui.element;
	
	var active = {
		tabAdd:function() {
			element.tabAdd('demo',{
				title:'订单管理1',
				content:'订单管理111',
				id:new Date().getTime()
			})
		}
		,tabDelete:function (othis) {
			element.tabDelete('demo','44');
			othis.addClass('layui-btn-disabled');
        },tabChange:function () {
			element.tabChange('demo','22');
        }
	}
});