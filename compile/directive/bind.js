'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _bind = require('../parser/bind');

var _bind2 = _interopRequireDefault(_bind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function addProperty(node, property, value) {
	if (property === 'class') {
		node.className = _.trim([node[property], value].join(' '));
	} else if (property === 'value') {
		node.value = value;
	} else {
		node.setAttribute(property, value);
	}
}

function removeProperty(node, property, value) {
	if (property === 'class') {
		node.className = node.className.replace(new RegExp('\\b' + value + '\\b'), '');
	} else {
		node.removeAttribute(property);
	}
}

function vBind(node, vm, value, property) {
	if (_.isType(value, 'object')) {
		for (var key in value) {
			if (value[key]) {
				addProperty(node, property, key);
			} else {
				removeProperty(node, property, key);
			}
		}
	} else {
		addProperty(node, property, value);
	}
}

exports.default = {
	update: function update(value) {
		vBind(this.$el, this.$vm, value, this.extraName);
	}
};