'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setScopeValue = exports.calculateExpression = exports.vFor = exports.vText = exports.vModel = undefined;

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// v-model
var vModel = function vModel(node, scope, key) {
	var tagName = node.tagName.toLowerCase();
	var value = calculateExpression(scope, key);
	if (tagName === 'input') {
		node.value = value;
	} else if (tagName === 'textarea') {
		node.innerHTML = value;
	}
};

// v-text
var vText = function vText(node, scope, key) {
	node.innerHTML = calculateExpression(scope, key);
};

// +,-,m.n,*,/
// 添加上下文
// AST?
var addScope = function addScope(exp) {
	var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'scope';

	exp = _.trim(exp);
	// x.y
	exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
		return [prefix, match].join('.');
	});
	exp = ' ' + exp + ' ';
	// x
	exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function (match, index, all) {
		return [prefix, _.trim(match)].join('.');
	});
	return _.trim(exp);

	// return exp.replace(/^([\'\w]*)\s*?([\+\-\*\/\.])?\s*?([\'\w]*)?$/, function(total, all, left, operater, right) {
	// 	if (left.indexOf('\'') === -1) {
	// 		left = [prefix, left].join('.');
	// 	}
	// 	if (right && right.indexOf('\'') === -1) {
	// 		if (operater !== '.') {
	// 			right = [prefix, right].join('.');
	// 		}
	// 		return left + operater + right;
	// 	}
	// 	return left;
	// });
};

// 计算表达式
// strict mode can not use with
// new Function
var calculateExpression = function calculateExpression(scope, exp) {
	var prefix = 'scope';
	exp = addScope(exp);
	var fn = new Function(prefix, 'return ' + exp);
	return fn(scope);
	// with(scope) {
	// 	return eval(exp);
	// }
};

// 设置属性值
var setScopeValue = function setScopeValue(scope, key, value) {
	if (~key.indexOf('.')) {
		var namespaces = key.split('.');
		var last = namespaces.pop();
		namespaces.forEach(function (name) {
			scope = scope[name] || (scope[name] = {});
		});
		scope[last] = value;
	} else {
		scope[key] = value;
	}
};

// v-for
var vFor = function vFor() {};

exports.vModel = vModel;
exports.vText = vText;
exports.vFor = vFor;
exports.calculateExpression = calculateExpression;
exports.setScopeValue = setScopeValue;