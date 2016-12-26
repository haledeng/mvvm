'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

var vModel = function vModel(node, vm, exp) {
	var tagName = node.tagName.toLowerCase();
	// var value = calculateExpression(scope, key);
	var value = (0, _expression.parseExpression)(vm, exp);
	if (tagName === 'input') {
		node.value = value;
	} else if (tagName === 'textarea') {
		node.innerHTML = value;
	}
	// node.removeAttribute('v-model');
};

exports.default = vModel;