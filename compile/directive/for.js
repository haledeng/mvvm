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

function vFor(node, scope, expression) {
	var parent = node.parentNode || node.__parent__;
	var tagName = node.tagName.toLowerCase();
	var expInfo = (0, _expression.parseForExpression)(expression);
	var val = (0, _expression.calculateExpression)(scope, expInfo.val);
	if (!_.isType(val, 'array')) return;
	var docFrag = document.createDocumentFragment();
	var template = node.innerHTML || node.__template__;
	// TODO: 计算node子节点中的表达式
	val.forEach(function (item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		var li = document.createElement(tagName);
		// TODO: attributes

		li.innerHTML = template;
		var context = {};
		context[expInfo.scope] = item;
		new _compiler2.default({
			el: li,
			// TODO: methods, filters
			vm: {
				$data: context
			}
		});
		docFrag.appendChild(li);
	});
	!node.__parent__ && parent.removeChild(node);
	node.__template__ = template;
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