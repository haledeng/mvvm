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
exports.trim = trim;
exports.isType = isType;