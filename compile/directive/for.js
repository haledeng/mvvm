'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('../parser/expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _compiler = require('../compiler/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _diffDom = require('../dom-diff/diffDom');

var _diffDom2 = _interopRequireDefault(_diffDom);

var _patch = require('../dom-diff/patch');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression, val) {
	// fix val=null，v-for中的模板还是在编译
	var parent = node.parentNode || node.__parent__;
	var expInfo = node._forInfo;
	var scope = vm.$data;
	var isTpl = node.tagName.toLowerCase() === 'template';
	// have to remove iterator template.
	if (['array', 'object'].indexOf(_.getType(val)) === -1) {
		// fix type error
		// val=null
		val = [];
	}
	var docFrag = document.createDocumentFragment();
	// temporary variables.
	var iterators = [expInfo.scope];
	if (expInfo.index) {
		iterators.push(expInfo.index);
	}
	// store old value
	var oldVals = _.getSubset(vm, iterators);
	_.forEach(val, function (item, index) {
		// support <template></template>
		var li = null;
		if (isTpl) {
			// template只能包含一个子节点，包含多个太复杂了
			li = document.createElement('div');
			li.innerHTML = node.innerHTML;
			var _frag = document.createDocumentFragment();
			[].slice.call(li.children).forEach(function (child) {
				_frag.appendChild(child);
			});
			li = _frag;
		} else {
			li = node.cloneNode(true);
			li.removeAttribute('v-for');
			li._dir = 'v-for';
			// set a parentNode property
			docFrag.appendChild(li);
		}

		li._iterators = {};

		li._iterators[expInfo.scope] = vm[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			li._iterators[expInfo.index] = vm[expInfo.index] = index;
		}
		new _compiler2.default({
			el: li,
			vm: vm
		});
		if (isTpl) docFrag.appendChild(li);
	});
	if (!isTpl) {
		if (!node.__anchor__) {
			node.__anchor__ = document.createTextNode('');
			node.__anchor__._dir = 'v-for';
		}
		// !node.__parent__ && parent.removeChild(node);
		!node.__parent__ && parent.replaceChild(node.__anchor__, node);
		node.__parent__ = parent;

		// console.log(docFrag.children);
		replaceChild(parent, docFrag);
		// var inserted = parent.insertBefore(docFrag, node.__anchor__);
		// node.__anchor__ = docFrag;
	} else {
		// template node
		parent.replaceChild(docFrag, node);
	}
	// recover same iterator key
	_.resetObject(oldVals, vm);
}

//TODO: component bug render
function replaceChild(node, docFrag) {

	var newNode = node.cloneNode(false);
	var children = [].concat(_toConsumableArray(node.childNodes));
	var hasInserted = false;
	children.forEach(function (child, index) {
		if (child.nodeType === 3 && child.wholeText === '') return;
		// component 编译时，_dir属性丢失
		if (!child._dir) {
			newNode.appendChild(child);
		} else {
			// 占位
			if (!hasInserted) {
				newNode.appendChild(docFrag);
				hasInserted = true;
			}
		}
	});

	// newNode.appendChild(docFrag);
	// dom-diff
	var diff = (0, _diffDom2.default)(node, newNode);
	console.log(diff);
	(0, _patch2.default)(diff);
}

exports.default = {
	bind: function bind() {},
	update: function update(value) {
		vFor.call(this, this.$el, this.$vm, this.expression, value);
	}
};