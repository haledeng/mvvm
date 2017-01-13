import {
	calculateExpression,
	parseForExpression
} from './expression';
import * as _ from '../util';
import Compiler from '../compiler/compiler';

import diffDom from '../dom-diff/diffDom';
import patch from '../dom-diff/patch';

// TODO: for循环作用域控制

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	// var expInfo = parseForExpression(expression);
	var expInfo = this._expInfo;
	var scope = vm.$data;
	var val = calculateExpression(scope, expInfo.val);
	if (!_.isType(val, 'array') || !val.length) return;
	var docFrag = document.createDocumentFragment();
	val.forEach(function(item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		var li = node.cloneNode(true);
		// maxnum call
		// TODO：v-for里面bind,on等作用域控制
		// 这里就替换节点里面的所有item？
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
		new Compiler({
			el: li,
			vm: Object.assign(vm.__proto__, vm, {
				$data: _.mixin(context, scope),
			})
		});

	});
	!node.__parent__ && parent.removeChild(node);
	// node.__template__ = template;
	// TODO: remove before
	node.__parent__ = parent;
	replaceChild(parent, docFrag);
	// node.__parent__ = replaceChild(parent, docFrag);
}

function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	var diff = diffDom(node, newNode);
	console.log(diff);
	// parent.replaceChild(newNode, node);
	// dom-diff
	// setTimeout(function() {
	patch(diff);
	// }, 1e3);
	// return newNode;
}

export default {
	bind: function() {
		this._expInfo = parseForExpression(this.expression);
	},
	update: function(value) {
		vFor.call(this, this.$el, this.$vm, this.expression);
	}
}
// export default vFor