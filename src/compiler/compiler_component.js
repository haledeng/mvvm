// 解析自定义component
// import Observer from '../observer';

import Component from '../component';
export default function(Compiler) {
	Compiler.prototype._parseComponent = function(node) {
		var allCom = this.$vm.constructor._globalCom;
		var descriptor = allCom[node.tagName.toLowerCase()];
		// var template = descriptor.template;
		// var frag = document.createDocumentFragment();
		// if (/^#/.test(template)) {
		// 	var tempDom = document.querySelector(template);
		// 	template = tempDom.innerHTML;
		// 	tempDom.parentNode.removeChild(tempDom);
		// }
		// var div = document.createElement('div');
		// div.innerHTML = template;
		// [].slice.call(div.children).forEach(function(child) {
		// 	frag.appendChild(child);
		// });
		var instance = new Component(descriptor.name, descriptor);
		var vm = this.$vm;
		// console.log(instance);
		var comVm = Object.assign(vm.__proto__, vm, {
			$data: instance.data,
			methods: instance.methods
				// $data: typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data,
				// methods: descriptor.methods
		});

		//  TODO: 组件和原来VM的关系
		//  每个Componet的instance是沙箱模式
		// vm.copyData2Vm.call(comVm);
		// frag.uid = ++cid;
		new Compiler({
			el: instance.frag,
			vm: comVm
		});
		node.parentNode.replaceChild(instance.frag, node);
	};
}