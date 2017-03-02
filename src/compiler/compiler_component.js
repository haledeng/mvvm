// 解析自定义component
// import Observer from '../observer';

import Component from '../component';
import {
	parseExpression
} from '../directive/expression';
import * as _ from '../util';

// 计算prop对应的value
function parseProps(props, vm, node) {
	var ret = {};
	props.forEach(function(prop) {
		ret[prop] = parseExpression(vm, node.getAttribute(_.kebabCase(prop)));
	});
	return ret;
}

function getComProps(node) {
	var attrs = [].slice.call(node.attributes) || [];
	var ret = {};
	attrs.map(function(attr) {
		ret[attr.name] = attr.value;
	})
	return ret;
}

export default function(Compiler) {
	Compiler.prototype._parseComponent = function(node) {
		var self = this;
		var allCom = this.$vm.constructor._globalCom;
		var descriptor = allCom[node.tagName.toLowerCase()];
		// var props = descriptor.props || [];
		// props获取的数据
		// props中的数据会被重复监听（component一次，MVVM初始化一次）
		// descriptor._data = parseProps(props, self.$vm, node);
		// component是全局VM的一个child
		var instance = new Component(descriptor.name, descriptor);
		var vm = this.$vm;

		var comVm = Object.create(vm.__proto__);
		comVm.methods = instance.methods;
		// 此处有问题，componet的data会覆盖vm中的数据
		// parse表达式时，向上查找
		comVm.$data = instance.data || {};
		// 遇到props，向上查找parent
		// comVm.props = descriptor.props || [];
		comVm.props = getComProps(node);
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		(vm.$children || (vm.$children = [])).push(comVm);

		//  每个Componet的instance是沙箱模式
		new Compiler({
			el: instance.frag,
			vm: comVm
		});
		node.parentNode.replaceChild(instance.frag, node);
	};
}