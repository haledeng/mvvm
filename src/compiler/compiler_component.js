// 解析自定义component
// import Observer from '../observer';

import Component from '../component';
import Watcher from '../observer/watcher';
import {
	parseExpression
} from '../directive/expression';
import * as _ from '../util';

function parseProps(props, vm, node) {
	var ret = {};
	props.forEach(function(prop) {
		ret[prop] = parseExpression(vm, node.getAttribute(_.kebabCase(prop)));
		// new Watcher({
		// 	vm: vm,
		// 	$el: node,
		// 	exp: prop,
		// 	callback: function(vm, value, oldValue) {
		// 		// TODO: component的props的监听回调
		// 		console.log(value);
		// 	}
		// });
	});
	return ret;
}


export default function(Compiler) {
	Compiler.prototype._parseComponent = function(node) {
		var self = this;
		var allCom = this.$vm.constructor._globalCom;
		var descriptor = allCom[node.tagName.toLowerCase()];
		var props = descriptor.props || [];
		// props获取的数据
		descriptor._data = parseProps(props, self.$vm, node);
		// component是全局VM的一个child
		var instance = new Component(descriptor.name, descriptor);
		var vm = this.$vm;

		var comVm = Object.create(vm.__proto__);
		comVm.methods = instance.methods;
		comVm.$data = instance.data;
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		(vm.$children || (vm.$children = [])).push(comVm);

		//  每个Componet的instance是沙箱模式
		new Compiler({
			el: instance.frag,
			vm: comVm
		});
		var commentNode = document.createComment(node.outerHTML);
		node.parentNode.insertBefore(commentNode, node);
		node.parentNode.insertBefore(instance.frag, node);
		node.parentNode.removeChild(node);
		// node.parentNode.replaceChild(instance.frag, node);

		// listener
		props.forEach(function(prop) {
			// new Watcher({
			// 	vm: vm,
			// 	$el: node,
			// 	exp: prop,
			// 	callback: function(vm, value, oldValue) {
			// 		// TODO: component的props的监听回调
			// 		// 重复监听data
			// 		console.log(value);
			// 	}
			// });
		});
	};
}