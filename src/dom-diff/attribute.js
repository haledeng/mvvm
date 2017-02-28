import * as _ from './util';
import * as camelize from './camelize';


var applyAttributes = function(node, props) {
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
var removeAttribute = function(node, propName) {
	node.removeAttribute(propName);
};
var patchObject = function(node, propName, propValue) {
	for (var k in propValue) {
		if (propValue[k] === undefined && propName === 'style') {
			node[propName].removeProperty(camelize.unCamel(k));
		} else {
			node[propName][k] = propValue[k];
		}
	}
};
var getAttr = function(node) {
	var attrs = [].slice.call(node.attributes) || [];
	var ret = {};
	// for (var i = 0; i < attrs.length; i++) {
	// 	var attr = attrs[i];
	// 	if (!_.isEmptyStr(attr.value)) {
	// 		ret[attr.name] = attr.value;
	// 	}
	// }
	attrs.map(function(attr) {
		if (!_.isEmptyStr(attr.value)) {
			ret[attr.name] = attr.value;
		}
	});
	return ret;
}
export {
	applyAttributes,
	removeAttribute,
	patchObject,
	getAttr
};