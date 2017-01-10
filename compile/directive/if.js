'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// function vIf(node, vm, exp) {
function vIf(node, vm, value) {
	var parent = node.parentNode || node.__parent__;
	// difference between nextSibling and nextElementSibling
	// get from node.childNode and node.children 
	var nextSibling = node.__nextSibling__ || node.nextElementSibling;

	var hasElseNext = this._hasElseNext;
	if (value) {
		if (node.__parent__) {
			// record the new node in document
			node.__new__ = insert(node.__new__ || node, parent);
		} else {
			// first time
			// clone新节点，删除v-if
			node.__new__ = replace(node, parent);
			node.__parent__ = parent;
		}
		if (hasElseNext) {
			node.__nextSibling__ = nextSibling;
			remove(nextSibling, parent);
		}
	} else {
		remove(node.__new__ || node, parent);
		if (hasElseNext) {
			node.__nextSibling__ = insert(nextSibling, parent);;
		}
	}
}

function replace(node, parent) {
	var newNode = node.cloneNode(true);
	newNode.removeAttribute('v-if');
	parent.replaceChild(newNode, node);
	return newNode;
}

function insert(node, parent) {
	var newNode = node.cloneNode(true);
	newNode.removeAttribute('v-if');
	newNode.removeAttribute('v-else');
	parent.replaceChild(newNode, node.__anchor__);
	return newNode;
}

function remove(node, parent) {
	// 这里应该是用something来占位，下次value变化是，直接替换
	// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
	// node.__anchor__ = document.createComment('v-if');
	node.__anchor__ = document.createTextNode('');
	parent.replaceChild(node.__anchor__, node);
	node.__parent__ = parent;
}

exports.default = {
	bind: function bind() {
		// 是否有v-else元素
		var nextSibling = this.$el.nextElementSibling;
		this._hasElseNext = nextSibling && nextSibling.getAttribute('v-else') !== null;
	},
	update: function update(value) {
		vIf.call(this, this.$el, this.$vm, value);
	}
};
// export default vIf;