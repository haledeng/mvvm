import Component from '../component';
import {
	parseExpression
} from '../parser/expression';
import * as _ from '../util';

export default function(Compiler) {
	Compiler.prototype._parseComponent = function(node) {
		var self = this;
		var allCom = this.$vm.constructor._globalCom;
		var vm = this.$vm;
		var descriptor = allCom[node.tagName.toLowerCase()];
		descriptor.parent = vm;
		// var props = descriptor.props || [];
		// props获取的数据
		// props中的数据会被重复监听（component一次，MVVM初始化一次）
		// component是全局VM的一个child
		var instance = new Component(node, descriptor.name, descriptor);

		var comVm = Object.create(vm.__proto__);
		comVm.methods = instance.methods;
		// parse表达式时，向上查找
		comVm.$data = instance.data || {};
		_.proxyData(comVm, '$data');
		comVm.props = _.parseNodeAttr2Obj(node);
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		(vm.$children || (vm.$children = [])).push(comVm);
		//  每个Componet的instance是沙箱模式
		new Compiler({
			el: instance.frag,
			vm: comVm
		});
		node._component = instance;
		node.parentNode && node.parentNode.replaceChild(instance.frag, node);
	};
}