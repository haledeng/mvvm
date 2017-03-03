'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _diffDom = require('../dom-diff/diffDom');

var _diffDom2 = _interopRequireDefault(_diffDom);

var _patch = require('../dom-diff/patch');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function vIf(node, vm, value) {
	// var hasElseNext = this._hasElseNext;
	if (value) {
		// 这种2次操作的方式，实际和未dom-diff差别不大
		if (this.$el.__anchor__) {
			(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el));
		}
		if (this.elseEl) {
			this.elseEl.__anchor__ = document.createTextNode('');
			(0, _patch2.default)((0, _diffDom2.default)(this.elseEl, this.elseEl.__anchor__));
		}
		// if (this.nextSibling.parentNode) {
		// 	patch(diffDom(this.nextSibling, this.$el));
		// }
	} else {
		this.$el.__anchor__ = document.createTextNode('');
		(0, _patch2.default)((0, _diffDom2.default)(this.$el, this.$el.__anchor__));
		if (this.elseEl) {
			(0, _patch2.default)((0, _diffDom2.default)(this.elseEl.__anchor__, this.elseEl));
		}
		// this.nextSibling修改了
		// patch(diffDom(this.$el, this.nextSibling));
	}
}

function removeNode(node) {
	node.__anchor__ = document.createTextNode('');
	return (0, _diffDom2.default)(node, node.__anchor__);
}

// function vIf(node, vm, value) {
// 	var parent = node.parentNode || node.__parent__;
// 	// difference between nextSibling and nextElementSibling
// 	// get from node.childNode and node.children
// 	var nextSibling = node.__nextSibling__ || node.nextElementSibling;

// 	var hasElseNext = this._hasElseNext;
// 	if (value) {
// 		if (node.__parent__) {
// 			// record the new node in document
// 			node.__new__ = insert(node.__new__ || node, parent);
// 		} else {
// 			// first time
// 			// clone新节点，删除v-if
// 			node.__new__ = replace(node, parent);
// 			node.__parent__ = parent;
// 		}
// 		if (hasElseNext) {
// 			node.__nextSibling__ = nextSibling;
// 			remove(nextSibling, parent);
// 		}
// 	} else {
// 		remove(node.__new__ || node, parent);
// 		if (hasElseNext) {
// 			node.__nextSibling__ = insert(nextSibling, parent);;
// 		}
// 	}
// }


// function replace(node, parent) {
// 	var newNode = node.cloneNode(true);
// 	newNode.removeAttribute('v-if');
// 	parent.replaceChild(newNode, node);
// 	return newNode;
// }

// function insert(node, parent) {
// 	var newNode = node.cloneNode(true);
// 	newNode.removeAttribute('v-if');
// 	newNode.removeAttribute('v-else');
// 	parent.replaceChild(newNode, node.__anchor__);
// 	return newNode;
// }

// function remove(node, parent) {
// 	// 这里应该是用something来占位，下次value变化是，直接替换
// 	// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
// 	// node.__anchor__ = document.createComment('v-if');
// 	node.__anchor__ = document.createTextNode('');
// 	parent.replaceChild(node.__anchor__, node);
// 	node.__parent__ = parent;
// }

exports.default = {
	bind: function bind() {
		// 是否有v-else元素
		var nextSibling = this.$el.nextElementSibling;
		if (nextSibling && nextSibling.getAttribute('v-else') !== null) {
			this.elseEl = nextSibling;
		}
		// this.nextSibling = nextSibling;
		// this._hasElseNext = ;
		// if (this._hasElseNext) {
		// 	this.nextSibling = nextSibling;
		// 	nextSibling.parentNode.removeChild(nextSibling);
		// } else {
		// 	this.nextSibling = document.createTextNode('');
		// }
	},
	update: function update(value) {
		vIf.call(this, this.$el, this.$vm, value);
	}
};
// export default vIf;