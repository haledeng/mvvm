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

exports.trim = trim;