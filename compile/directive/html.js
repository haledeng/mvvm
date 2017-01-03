'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// v-html
var vHtml = function vHtml(node, vm, value) {
	node.innerHTML = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-html');
};

exports.default = {
	bind: function bind() {},
	update: function update(value) {
		node.innerHTML = value;
	}
};