'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

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

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var expInfo = this._expInfo;
	var scope = vm.$data;
	// var val = calculateExpression(scope, expInfo.val);
	// parseExpression
	var val = (0, _expression.parseExpression)(vm, expInfo.val, 'for', node);
	if (vm.props && vm.props[expInfo.val]) {
		val = (0, _expression.calculateExpression)(vm.$parent.$data, vm.props[expInfo.val]);
	}
	if (!_.isType(val, 'array') && !_.isType(val, 'object')) return;
	var docFrag = document.createDocumentFragment();
	forEach(val, function (item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		var li = node.cloneNode(true);
		li.removeAttribute('v-for');
		var nodeScope = li.__scope__ = {
			val: expInfo.val
		};
		var context = {};
		context[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			context[expInfo.index] = index;
			nodeScope.$index = expInfo.index;
			nodeScope.index = index;
		}
		docFrag.appendChild(li);
		nodeScope.$item = expInfo.scope;
		nodeScope.item = item;
		/**
   * item直接挂在$data下面，其中操作item会导致问题，
   * 都是操作同一份item
   * 渲染的时候，其实没有什么问题，每次item都不一致，
   * 但是write的时候，有问题
   */
		new _compiler2.default({
			el: li,
			vm: Object.assign(vm.__proto__, vm, {
				$data: _.mixin(context, scope)
			})
		});
	});
	!node.__parent__ && parent.removeChild(node);
	node.__parent__ = parent;
	// console.log(docFrag.children);
	replaceChild(parent, docFrag);
	// node.__parent__ = replaceChild(parent, docFrag);
}

function forEach(val, fn) {
	if (_.isType(val, 'array')) {
		val.forEach(fn);
	} else if (_.isType(val, 'object')) {
		Object.keys(val).forEach(function (key) {
			fn(val[key], key);
		});
	}
}

function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	// parent.replaceChild(newNode, node);
	// return newNode;
	// dom-diff
	var diff = (0, _diffDom2.default)(node, newNode);
	console.log(diff);
	(0, _patch2.default)(diff);
}

exports.default = {
	bind: function bind() {
		this._expInfo = (0, _expression.parseForExpression)(this.expression);
	},
	update: function update(value) {
		vFor.call(this, this.$el, this.$vm, this.expression);
	}
};
// export default vFor