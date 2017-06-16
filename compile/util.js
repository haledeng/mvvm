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
	var globalObjReg = /^(Math|window|document|location|navigator|screen|true|false)/;
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

var extendScope = function extendScope(obj, vm) {
	var oldVals = {};
	forEach(obj, function (value, key) {
		// record old value.
		oldVals[key] = vm[key];
		vm[key] = value;
	});
	return oldVals;
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

// 重置原来的对象
var resetObject = function resetObject(oldVals, vm) {
	forEach(oldVals, function (value, key) {
		if (value == undefined) {
			delete vm[key];
		} else {
			vm[key] = value;
		}
	});
	oldVals = null;
};

// 向上查找当前作用域迭代器
// v-for中的临时变量
function getIterators(node) {
	var parent = node;
	while (parent && !parent._iterators) {
		parent = parent.parentNode;
	}
	return parent ? parent._iterators : null;
}

var getVal = function getVal(obj, namespace) {
	var names = namespace.split('.'),
	    len = names.length,
	    i = 1,
	    ret = obj[names[0]];
	if (typeof ret === 'undefined') return '';
	while (i < len && obj) {
		ret = ret[names[i++]];
	}
	return ret;
};

// 键码
var KEYCODE_MAP = {
	'enter': 13,
	'esc': 27
};

var getKeyCode = function getKeyCode(key) {
	return KEYCODE_MAP[key] || 0;
};

var getKeyCodes = function getKeyCodes(keys) {
	var codes = [];
	forEach(keys, function (key) {
		codes.push(getKeyCode(key));
	});
	return codes;
};

// get key by keycode
var getKey = function getKey(code) {
	for (var key in KEYCODE_MAP) {
		if (KEYCODE_MAP[key] === code) return key;
	}
	return '';
};

function parseNodeAttr2Obj(node) {
	var attrs = [].slice.call(node.attributes) || [];
	var ret = {};
	attrs.map(function (attr) {
		ret[attr.name] = attr.value;
	});
	return ret;
}

var proxyData = function proxyData(vm, prop) {
	var keys = Object.keys(vm[prop]);
	var self = vm;
	keys.map(function (key) {
		// proxy all property from data into instance.
		Object.defineProperty(vm, key, {
			configurable: true,
			enumerable: true,
			get: function get() {
				return self[prop][key];
			},
			set: function set(val) {
				self[prop][key] = val;
			}
		});
	});
};
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
exports.extendScope = extendScope;
exports.getVal = getVal;
exports.getKeyCode = getKeyCode;
exports.getKeyCodes = getKeyCodes;
exports.getKey = getKey;
exports.parseNodeAttr2Obj = parseNodeAttr2Obj;
exports.proxyData = proxyData;