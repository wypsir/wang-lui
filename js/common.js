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
        }
    }

    exports(module_name, common);
})