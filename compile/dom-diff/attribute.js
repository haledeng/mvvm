'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getAttr = exports.patchObject = exports.removeAttribute = exports.applyAttributes = undefined;

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _camelize = require('./camelize');

var camelize = _interopRequireWildcard(_camelize);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var applyAttributes = function applyAttributes(node, props) {
	for (var propName in props) {
		var propValue = props[propName];
		if (typeof propValue === 'undefined') {
			this.removeAttribute(node, propName);
		} else {
			if (_.isObject(propValue)) {
				this.patchObject(node, propName, propValue);
			} else {
				node.setAttribute(propName, propValue);
			}
		}
	}
};
var removeAttribute = function removeAttribute(node, propName) {
	node.removeAttribute(propName);
};
var patchObject = function patchObject(node, propName, propValue) {
	for (var k in propValue) {
		if (propValue[k] === undefined && propName === 'style') {
			node[propName].removeProperty(camelize.unCamel(k));
		} else {
			node[propName][k] = propValue[k];
		}
	}
};
var getAttr = function getAttr(node) {
	var attrs = node.attributes;
	var ret = {};
	for (var i = 0; i < attrs.length; i++) {
		var attr = attrs[i];
		if (!_.isEmptyStr(attr.value)) {
			ret[attr.name] = attr.value;
		}
	}
	return ret;
};
exports.applyAttributes = applyAttributes;
exports.removeAttribute = removeAttribute;
exports.patchObject = patchObject;
exports.getAttr = getAttr;