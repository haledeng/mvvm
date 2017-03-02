'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 计算表达式
// new Function
var calculateExpression = function calculateExpression(scope, exp) {
	var prefix = 'scope';
	exp = _.addScope(exp);
	var fn = new Function(prefix, 'return ' + exp);
	return fn(scope);
	// with. //strict mode.
};

exports.default = calculateExpression;