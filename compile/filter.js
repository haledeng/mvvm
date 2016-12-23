'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.parseFilter = exports.filter = undefined;

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// filters 过滤器
function filter(vm, name, params) {
	var method = vm.filters[name];
	return method.apply(vm.$data, [params].concat([].slice.call(arguments, 3)));
}

// 解析filter表达式
function parseFilter(str) {
	if (!str || str.indexOf('|') === -1) return null;
	var splits = str.split('|');
	var paramName = _.trim(splits[0]);
	// paramName | filterName arg1 arg2
	var args = _.trim(splits[1]).split(' ');
	var methodName = args.shift();
	console.log(args);
	return {
		param: paramName,
		args: typeCheck(args),
		method: methodName
	};
}

// 类型转化
function typeCheck(args) {
	var rets = [];
	args.forEach(function (arg, index) {
		arg = _.trim(arg);
		if (/^[0-9]$/.test(arg)) {
			rets[index] = Number(arg);
		} else {
			rets[index] = arg;
		}
	});
	return rets;
}

exports.filter = filter;
exports.parseFilter = parseFilter;