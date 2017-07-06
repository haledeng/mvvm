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
		// props获取的数据
		// props中的数据会被重复监听（component一次，MVVM初始化一次）
		// component是全局VM的一个child
		var comVm = Object.create(vm.__proto__);
		var instance = new Component(node, descriptor.name, descriptor, comVm);


		comVm.methods = instance.methods;
		// parse表达式时，向上查找
		// comVm.$data = instance.data || {};


		comVm.props = _.parseNodeAttr2Obj(node);
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		// TODO: directives
		(vm.$children || (vm.$children = [])).push(comVm);
		//  每个Componet的instance是沙箱模式
		if (instance.frag) {
			new Compiler({
				el: instance.frag,
				vm: comVm
			});
		}
		// _.resetObject(oldVals, comVm.$data);
		node._component = instance;
		node.parentNode && node.parentNode.replaceChild(instance.frag, node);
	};
}