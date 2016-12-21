'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// event hander
// 事件多次绑定
function vOn(node, methods, value) {
    if (typeof value !== 'string') return;
    var method = methods[value] || function () {};
    var self = this;
    node.addEventListener('click', function () {
        method.call(self);
    }, false);
}

exports.default = vOn;