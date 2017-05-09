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

// 属性转化
function transformProperty(property) {
	if (property === 'class') {
		return 'className';
	}
	return property;
}

function addProperty(node, property, value) {
	property = transformProperty(property);
	if (property === 'className') {
		node[property] = _.trim([node[property], value].join(' '));
	} else {
		node.setAttribute(property, value);
	}
}

function removeProperty(node, property, value) {
	property = transformProperty(property);
	if (property === 'className') {
		node[property] = node[property].replace(new RegExp('\\b' + value + '\\b'), '');
	} else {
		node.removeAttribute(property);
	}
}

function vBind(node, vm, value, property) {
	for (var key in value) {
		if (value[key]) {
			addProperty(node, property, key);
		} else {
			removeProperty(node, property, key);
		}
	}
	// issue
	// 删除会导致后面的属性遍历有问题
	// 在遍历数组同时，在删除数组元素
	// node.removeAttribute('v-bind:' + property);
}

// export default vBind;

exports.default = {
	bind: function bind() {},
	update: function update(value) {
		// debugger;
		vBind(this.$el, this.$vm, value, this.extraName);
	}
};