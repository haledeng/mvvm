import {
	calculateExpression,
	parseForExpression
} from './expression';
import * as _ from '../util';
import Compiler from '../compiler';



function vFor(node, scope, expression) {
	var parent = node.parentNode || node.__parent__;
	var tagName = node.tagName.toLowerCase();
	var expInfo = parseForExpression(expression);
	var val = calculateExpression(scope, expInfo.val);
	if (!_.isType(val, 'array')) return;
	var docFrag = document.createDocumentFragment();
	var template = node.__template__ || node.innerHTML;
	// TODO: 计算node子节点中的表达式
	val.forEach(function(item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		var li = document.createElement(tagName);
		// TODO: attributes
		li.innerHTML = template;
		var context = {};
		context[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			context[expInfo.index] = index;
		}
		new Compiler({
			el: li,
			// TODO: methods, filters
			vm: {
				// $data: context
				$data: _.mixin(context, scope)
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

export default vFor