import Component from '../component';
import {
	parseExpression
} from '../parser/expression';
import * as _ from '../util';


// function initProps(comVm, props) {
// 	for (var key in props) {
// 		Object.defineProperty(target, key, {
// 			enumerable: true,
// 			configable: true,
// 			get: function() {
// 				return this[sourceKey][key];
// 			},
// 			set: function(val) {
// 				this[sourceKey][key] = val;
// 			}
// 		});
// 	}
// }

// TODO: component -> slot
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
		var instance = new Component(descriptor.name, descriptor);

		var comVm = Object.create(vm.__proto__);
		comVm.methods = instance.methods;
		// parse表达式时，向上查找
		comVm.$data = instance.data || {};
		// 遇到props，向上查找parent
		// comVm.props = descriptor.props || [];
		comVm.props = _.parseNodeAttr2Obj(node);
		// var props = descriptor.props || {};
		// initProps(comVm, props);
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
		// node._frag = instance.frag;

		// console.log(instance.frag);
		node.parentNode && node.parentNode.replaceChild(instance.frag, node);
	};
}