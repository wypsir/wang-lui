/**
 * 这是一个layui模块
 * common 公共包
 */
layui.define('layer', function (exports) {
    'use strict';
    var module_name = "common",
        $ = layui.jquery,
        layer = layui.layer;

    var common = {
        /**
         * 抛出一个异常错误信息
         * @param msg
         */
        throwError: function (msg) {
            throw new Error(msg);
            return;
        },
        /**
         * 弹出错误提示
         * @param msg
         */
        msgError: function (msg) {
            layer.msg(msg, {icon: 5})
            return;
        },
        data:function (table, settings) {
            //本地存储
            console.log(table)
                table = table || 'wui';

            console.log(table)
                if(!window.JSON || !window.JSON.parse) return;

                //如果settings为null，则删除表
                if(settings === null){
                    return delete sessionStorage[table];
                }

                settings = typeof settings === 'object'
                    ? settings
                    : {key: settings};

                try{
                    var data = JSON.parse(sessionStorage[table]);
                } catch(e){
                    var data = {};
                }

                if(settings.value) data[settings.key] = settings.value;
                if(settings.remove) delete data[settings.key];
                sessionStorage[table] = JSON.stringify(data);

                return settings.key ? data[settings.key] : data;
        }
    }

    exports(module_name, common);
})