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

// add context to expression
var addScope = function addScope(exp) {
	var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

	// Global Object call
	var globalObjReg = /^(Math|window|document|location|navigator|screen)/;
	// begin with variables
	return exp.replace(/^[\w\[\]\-]+/g, function (all) {
		if (globalObjReg.test(all)) return all;
		return [prefix, all].join('.');
	}).replace(/([\s\=])([\w\[\]\-]+)/g, function (match, sep, val, index, all) {
		if (/^\d*$/.test(val) || globalObjReg.test(val)) return match;
		return sep + [prefix, val].join('.');
	}).replace(/\(([\w\[\]\-]+)\)/g, function (match, val, index, all) {
		if (/^\d*$/.test(val) || globalObjReg.test(val) || /^[\'\"]/.test(val)) return match;
		return '(' + [prefix, val].join('.') + ')';
	});
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

var praviteIterator = function praviteIterator(str) {
	return str ? '_' + str + '_' : '';
};

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

var parseStr2Obj = function parseStr2Obj(str, fn) {
	var ret = {};
	if (!str) return ret;
	str = trim(str.replace(/^\{|\}$/g, ''));
	str.replace(/([^\:\,]*)\:([^\,]*)/g, function (all, key, value) {
		ret[key] = fn ? fn(value) : value;
	});
	return ret;
};

// wrap forEach
function forEach(val, fn) {
	if (isType(val, 'array')) {
		val.forEach(fn);
	} else if (isType(val, 'object')) {
		Object.keys(val).forEach(function (key) {
			fn(val[key], key);
		});
	} else {}
}

// get subset of object
var getSubset = function getSubset(obj, keys) {
	var ret = {},
	    type = getType(keys);
	if ('object' === type) return null;
	if ('string' === type) keys = [keys];
	forEach(keys, function (value, key) {
		ret[value] = obj[value];
	});
	return ret;
};

var resetObject = function resetObject(oldVals, vm) {
	forEach(oldVals, function (value, key) {
		if (value == undefined) {
			delete vm[key];
		} else {
			vm[key] = value;
		}
	});
};

function getIterators(node) {
	var parent = node;
	while (parent && !parent._iterators) {
		parent = parent.parentNode;
	}
	return parent ? parent._iterators : null;
}

// empty function
var noop = function noop() {};

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
exports.setScopeValue = setScopeValue;
exports.noop = noop;
exports.parseStr2Obj = parseStr2Obj;
exports.forEach = forEach;
exports.getSubset = getSubset;
exports.resetObject = resetObject;
exports.getIterators = getIterators;