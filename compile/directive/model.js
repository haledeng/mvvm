'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var vModel = function vModel(node, vm, value) {
	var tagName = node.tagName.toLowerCase();
	if (tagName === 'input') {
		node.value = value;
	} else if (tagName === 'textarea') {
		node.textContent = value;
	}
	node.removeAttribute('v-model');
};

exports.default = vModel;