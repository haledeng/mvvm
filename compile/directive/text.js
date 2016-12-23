'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

var _filter = require('../filter');

// v-text
var vText = function vText(node, scope, key) {
	// var scope = vm.$data;
	// var rets = parseFilter(key);
	// if (rets) {
	// 	var value = calculateExpression(scope, rets.param);
	// 	node.innerHTML = filter.apply(null, [vm, rets.method, value].concat(rets.args));
	// 	return;
	// }
	node.innerHTML = (0, _expression.calculateExpression)(scope, key);
	// 影响后面attribute遍历
	// node.removeAttribute('v-text');
};

exports.default = vText;