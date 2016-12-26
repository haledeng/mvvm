'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

// v-text
var vText = function vText(node, vm, key) {
	node.innerHTML = (0, _expression.parseExpression)(vm, key);
	// 影响后面attribute遍历
	// node.removeAttribute('v-text');
};

exports.default = vText;