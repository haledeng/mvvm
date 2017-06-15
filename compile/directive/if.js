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
	if (value) {
		// 这种2次操作的方式，实际和未dom-diff差别不大
		if (this.$el.__anchor__) {
			if (this.$el._component) {
				(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el._component.frag.firstElementChild));
			} else {
				(0, _patch2.default)((0, _diffDom2.default)(this.$el.__anchor__, this.$el));
			}
		}
		if (this.elseEl) {
			this.elseEl.__anchor__ = document.createTextNode('');
			(0, _patch2.default)((0, _diffDom2.default)(this.elseEl, this.elseEl.__anchor__));
		}
	} else {
		this.$el.__anchor__ = document.createTextNode('');
		if (this.$el._component) {
			(0, _patch2.default)((0, _diffDom2.default)(this.$el._component.frag.firstElementChild, this.$el.__anchor__));
		} else {
			(0, _patch2.default)((0, _diffDom2.default)(this.$el, this.$el.__anchor__));
		}
		if (this.elseEl) {
			(0, _patch2.default)((0, _diffDom2.default)(this.elseEl.__anchor__, this.elseEl));
		}
	}
}

function removeNode(node) {
	node.__anchor__ = document.createTextNode('');
	return (0, _diffDom2.default)(node, node.__anchor__);
}

exports.default = {
	bind: function bind() {
		// 是否有v-else元素
		var nextSibling = this.$el.nextElementSibling;
		if (nextSibling && nextSibling.getAttribute('v-else') !== null) {
			this.elseEl = nextSibling;
		}
	},
	update: function update(value) {
		vIf.call(this, this.$el, this.$vm, value);
	}
};