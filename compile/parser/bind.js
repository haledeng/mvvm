'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = parseBind;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _expression = require('../parser/expression');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * [parseBind description]
 * @param  {Object} vm   instance
 * @param  {String} attr expression
 * @return {Object}      value of the expression
 */
// parse bind expression
function parseBind(vm, attr) {
	attr = _.trim(attr);
	var data = vm;
	// var data = vm.$data;
	var computed = vm.computed;
	var value = {};
	if (/^\{(.*)\}$/.test(attr)) {
		// 计算表达式
		attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function (all, key, val) {
			value[_.trim(key)] = (0, _expression.calculateExpression)(data, _.trim(val));
			return all;
		});
	} else if (/\w*/.test(attr)) {
		// computed已经被计算
		// value = data[attr];
		// a.b.c
		value = _.getVal(data, attr);
	}
	return value;
}