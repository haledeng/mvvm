'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _expression = require('./expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function vIf(node, vm, exp) {
	var value = (0, _expression.calculateExpression)(vm.$data, exp);
	var parent = node.parentNode || node.__parent__;
	if (value) {
		if (node.__parent__) {
			var newNode = node.cloneNode(true);
			newNode.removeAttribute('v-if');
			parent.appendChild(newNode);
			parent.replaceChild(newNode, node.__anchor__);
		}
	} else {
		// 这里应该是用something来占位，下次value变化是，直接替换
		// vue中使用注释来占位的,或者创建空的textNode，证实上面的猜想
		// node.__anchor__ = document.createComment('v-if');
		node.__anchor__ = document.createTextNode('');
		parent.replaceChild(node.__anchor__, node);
		node.__parent__ = parent;
	}
}

exports.default = vIf;