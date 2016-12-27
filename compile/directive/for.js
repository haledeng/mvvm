'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _compiler = require('../compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var tagName = node.tagName.toLowerCase();
	var expInfo = (0, _expression.parseForExpression)(expression);
	var scope = vm.$data;
	var val = (0, _expression.calculateExpression)(scope, expInfo.val);
	if (!_.isType(val, 'array') || !val.length) return;
	var docFrag = document.createDocumentFragment();
	// var template = node.__template__ || node.innerHTML;
	val.forEach(function (item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		// var li = document.createElement(tagName);
		// TODO: attributes
		// li.innerHTML = template;
		var li = node.cloneNode(true);
		// maxnum call
		li.removeAttribute('v-for');
		var context = {};
		context[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			context[expInfo.index] = index;
		}
		docFrag.appendChild(li);
		new _compiler2.default({
			el: li,
			// TODO: methods, filters
			vm: {
				$data: _.mixin(context, scope),
				methods: vm.methods,
				filters: vm.filters
			}
		});
	});
	!node.__parent__ && parent.removeChild(node);
	// node.__template__ = template;
	// TODO: remove before
	node.__parent__ = replaceChild(parent, docFrag);
	// parent.replaceChild(docFrag, parent.lastChild);
}

function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	parent.replaceChild(newNode, node);
	return newNode;
}

exports.default = vFor;