'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var vText = function vText(node, vm, value) {
	node.textContent = value;
	// 影响后面attribute遍历
	node.removeAttribute('v-text');
};

exports.default = vText;