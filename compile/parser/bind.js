'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // parse bind expression


exports.default = parseBind;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function hasBind(expression) {}

/**
 * [parseBind description]
 * @param  {Object} vm   instance
 * @param  {String} attr expression
 * @return {Object}      value of the expression
 */
function parseBind(vm, attr) {
	attr = _.trim(attr);
	var data = vm.$data;
	var computed = vm.computed;
	var value = {};
	if (/^\{(.*)\}$/.test(attr)) {
		// 计算表达式
		attr.replace(/([^\{\,\:]*):([^\,\:\}]*)/g, function (all, key, val) {
			value[_.trim(key)] = data[_.trim(val)];
			return all;
		});
	} else if (/\w*/.test(attr)) {
		// computed or data.property
		if (_typeof(data[attr]) === 'object') {
			value = data[attr];
		} else if (typeof computed[attr] === 'function') {
			value = computed[attr].apply(data);
		}
	}
	return value;
}