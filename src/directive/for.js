import {
	parseExpression
} from '../parser/expression';
import * as _ from '../util';
import Compiler from '../compiler/compiler';

import diffDom from '../dom-diff/diffDom';
import patch from '../dom-diff/patch';

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var expInfo = node._info;
	var scope = vm.$data;
	// parseExpression
	// var val = parseExpression(vm, expInfo.val, 'for', node);
	var val = node._vForValue;
	if (['array', 'object'].indexOf(_.getType(val)) === -1) return;
	var docFrag = document.createDocumentFragment();
	var iterators = [expInfo.scope];
	if (expInfo.index) {
		iterators.push(expInfo.index);
	}
	// store old value
	var oldVals = _.getSubset(vm, iterators);
	// var temp = {};
	_.forEach(val, function(item, index) {
		var li = node.cloneNode(true);
		li.removeAttribute('v-for');

		li._iterators = {};

		li._iterators[expInfo.scope] = vm[expInfo.scope] = item;
		// temp[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			li._iterators[expInfo.index] = vm[expInfo.index] = index;
			// temp[expInfo.index] = index;
		}
		docFrag.appendChild(li);
		// debugger;
		// item 临时挂载到vm下
		new Compiler({
			el: li,
			vm: vm
				// vm: Object.assign(vm, temp)
		});
	});
	!node.__parent__ && parent.removeChild(node);
	node.__parent__ = parent;
	replaceChild(parent, docFrag);
	// recover same iterator key
	_.resetObject(oldVals, vm);
	oldVals = null;
	console.log(vm);
}



function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	// dom-diff
	var diff = diffDom(node, newNode);
	console.log(diff);
	patch(diff);
}

export default {
	bind: function() {
		// this._expInfo = this.$el._info;
	},
	update: function(value) {
		this.$el._vForValue = value;
		vFor.call(this, this.$el, this.$vm, this.expression);
	}
}
// export default vFor