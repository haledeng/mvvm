'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var trim = function trim(str) {
	if (typeof str !== 'string') {
		return Object.prototype.toString.call(str);
	}
	return str.replace(/^\s*|\s*$/g, '');
};

var toString = Object.prototype.toString;

var isType = function isType(obj, type) {
	return toString.call(obj) === '[object ' + type.replace(/^[a-z]/, type.charAt(0).toUpperCase()) + ']';
};

var getType = function getType(obj) {
	return toString.call(obj).replace(/^\[object\s|\]$/g, '').toLowerCase();
};

var mixin = function mixin(dest, source) {
	var rewrite = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	for (var prop in source) {
		if (source.hasOwnProperty(prop)) {
			if (!rewrite || !dest.hasOwnProperty(prop)) {
				dest[prop] = source[prop];
			}
		}
	}
	return dest;
};

var containOnlyTextNode = function containOnlyTextNode(node) {
	return !node.children.length && node.childNodes.length;
};

var upperFirst = function upperFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
};

var addScope = function addScope(exp) {
	var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

	exp = trim(exp);
	// x.y
	// Math.random()  全局函数调用
	var globalObject = ['Math', 'window', 'Date', 'navigator', 'document'];
	exp = exp.replace(/[\w\[\]]+(?=\.)/g, function (match, index, all) {
		if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
		return [prefix, match].join('.');
	});
	exp = ' ' + exp + ' ';
	// x
	exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function (match, index, all) {
		match = trim(match);
		if (/^[0-9]*$/.test(match)) {
			return match;
		}
		return [prefix, match].join('.');
	});
	return trim(exp);
};

var isArrayEqual = function isArrayEqual(a, b) {
	if (isType(a, 'array') && isType(b, 'array')) {
		if (a.length !== b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (a[i] != b[i]) return false;
		}
		return true;
	}
	return false;
};

var isObjectEqual = function isObjectEqual(a, b) {
	if (isType(a, 'object') && isType(b, 'object')) {
		var aKeys = Object.keys[a];
		if (aKeys.length !== Object.keys(b).length) return false;
		for (var i = 0; i < aKeys.length; i++) {
			// ===?
			if (a[aKeys[i]] != b[aKeys[i]]) return false;
		}
		return true;
	}
	return false;
};

var kebabCase = function kebabCase(str) {
	if (typeof str !== 'string') return '';
	return str.replace(/[A-Z]/, function (all) {
		return '-' + all.toLowerCase();
	});
};

exports.trim = trim;
exports.isType = isType;
exports.mixin = mixin;
exports.upperFirst = upperFirst;
exports.containOnlyTextNode = containOnlyTextNode;
exports.addScope = addScope;
exports.kebabCase = kebabCase;
exports.getType = getType;
exports.isObjectEqual = isObjectEqual;
exports.isArrayEqual = isArrayEqual;