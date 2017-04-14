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

// wrap forEach
function forEach(val, fn) {
	if (_.isType(val, 'array')) {
		val.forEach(fn);
	} else if (_.isType(val, 'object')) {
		Object.keys(val).forEach(function (key) {
			fn(val[key], key);
		});
	} else {}
}

// get subset of object
var getSubset = function getSubset(obj, keys) {
	var ret = {},
	    type = _.getType(keys);
	if ('object' === type) return null;
	if ('string' === type) keys = [keys];
	forEach(keys, function (value, key) {
		ret[key] = value;
	});
	return ret;
};

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var expInfo = node._info;
	var scope = vm.$data;
	// parseExpression
	var val = (0, _expression.parseExpression)(vm, expInfo.val, 'for', node);
	if (['array', 'object'].indexOf(_.getType(val)) === -1) return;
	var docFrag = document.createDocumentFragment();
	var iterators = [expInfo.scope];
	if (expInfo.index) {
		iterators.push(expInfo.index);
	}
	// store old value
	var oldVals = getSubset(vm, iterators);
	forEach(val, function (item, index) {
		var li = node.cloneNode(true);
		li.removeAttribute('v-for');

		vm[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			vm[expInfo.index] = index;
		}
		docFrag.appendChild(li);
		// item 临时挂载到vm下
		new _compiler2.default({
			el: li,
			vm: vm
		});
	});
	!node.__parent__ && parent.removeChild(node);
	node.__parent__ = parent;
	replaceChild(parent, docFrag);
	// recover same iterator key
	forEach(oldVals, function (value, key) {
		vm[key] = value;
	});
}

function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	// dom-diff
	var diff = (0, _diffDom2.default)(node, newNode);
	console.log(diff);
	(0, _patch2.default)(diff);
}

exports.default = {
	bind: function bind() {
		// this._expInfo = this.$el._info;
	},
	update: function update(value) {
		vFor.call(this, this.$el, this.$vm, this.expression);
	}
};
// export default vFor