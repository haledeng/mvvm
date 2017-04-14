import {
	calculateExpression,
	parseForExpression,
	parseExpression
} from './expression';
import * as _ from '../util';
import Compiler from '../compiler/compiler';

import diffDom from '../dom-diff/diffDom';
import patch from '../dom-diff/patch';

// get subset of object
var getSubset = function(obj, keys) {
	var ret = {};
	if (_.isType(keys, 'object')) return null;
	if (_.isType(keys, 'string')) keys = [keys];
	keys.forEach(function(key) {
		ret[key] = obj[key];
	});
	return ret;
}

// 会二次执行，监听的元素变化时，会重新调用vfor
function vFor(node, vm, expression) {
	var parent = node.parentNode || node.__parent__;
	var expInfo = this._expInfo;
	var scope = vm.$data;
	// parseExpression
	var val = parseExpression(vm, expInfo.val, 'for', node);
	if (vm.props && vm.props[expInfo.val]) {
		val = calculateExpression(vm.$parent.$data, vm.props[expInfo.val]);
	}
	if (!_.isType(val, 'array') && !_.isType(val, 'object')) return;
	var docFrag = document.createDocumentFragment();
	var iterators = [expInfo.scope];
	if (expInfo.index) {
		iterators.push(expInfo.index);
	}
	// store old value
	var oldVals = getSubset(vm, iterators);
	forEach(val, function(item, index) {
		// 子节点如何编译，Compiler中可以，但是需要修改scope
		var li = node.cloneNode(true);
		li.removeAttribute('v-for');

		vm[expInfo.scope] = item;
		if (expInfo.index !== undefined) {
			vm[expInfo.index] = index;
		}
		docFrag.appendChild(li);
		/**
		 * item直接挂在$data下面，其中操作item会导致问题，
		 * 都是操作同一份item
		 * 渲染的时候，其实没有什么问题，每次item都不一致，
		 * 但是write的时候，有问题
		 */
		// var _vm = Object.assign(vm.__proto__, vm, {
		// 	$data: _.mixin(context, scope),
		// 	// $data: _.mixin(context, vm),
		// });
		new Compiler({
			el: li,
			vm: vm
		});
	});
	!node.__parent__ && parent.removeChild(node);
	node.__parent__ = parent;
	replaceChild(parent, docFrag);
	// recover same iterator key
	forEach(oldVals, function(value, key) {
		vm[key] = value;
	});
}


function forEach(val, fn) {
	if (_.isType(val, 'array')) {
		val.forEach(fn);
	} else if (_.isType(val, 'object')) {
		Object.keys(val).forEach(function(key) {
			fn(val[key], key);
		})
	} else {}
}


function replaceChild(node, docFrag) {
	var parent = node.parentNode;
	var newNode = node.cloneNode(false);
	newNode.appendChild(docFrag);
	// parent.replaceChild(newNode, node);
	// return newNode;
	// dom-diff
	var diff = diffDom(node, newNode);
	console.log(diff);
	patch(diff);
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