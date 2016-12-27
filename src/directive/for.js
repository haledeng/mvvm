import {
	calculateExpression,
	parseForExpression
} from './expression';
import * as _ from '../util';
import Compiler from '../compiler';



// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var tagName = node.tagName.toLowerCase();
	var expInfo = parseForExpression(expression);
	var scope = vm.$data;
	var val = calculateExpression(scope, expInfo.val);
	if (!_.isType(val, 'array') || !val.length) return;
	var docFrag = document.createDocumentFragment();
	// var template = node.__template__ || node.innerHTML;
	val.forEach(function(item, index) {
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
		new Compiler({
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

export default vFor