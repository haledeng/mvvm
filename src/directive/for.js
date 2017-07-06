import {
	parseExpression
} from '../parser/expression';
import * as _ from '../util';
import Compiler from '../compiler/compiler';

import diffDom from '../dom-diff/diffDom';
import patch from '../dom-diff/patch';

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
	_.forEach(val, function(item, index) {
		// support <template></template>
		var li = null;
		if (isTpl) {
			// template只能包含一个子节点，包含多个太复杂了
			li = document.createElement('div');
			li.innerHTML = node.innerHTML;
			var _frag = document.createDocumentFragment();
			[].slice.call(li.children).forEach(function(child) {
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
		new Compiler({
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
	var children = [...node.childNodes];
	var hasInserted = false;
	children.forEach((child, index) => {
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
	var diff = diffDom(node, newNode);
	console.log(diff);
	patch(diff);
}

export default {
	bind: function() {},
	update: function(value) {
		vFor.call(this, this.$el, this.$vm, this.expression, value);
	}
}