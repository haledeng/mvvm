// import Compiler from './complier/complier';
import Observer from './observer';
class Component {
	constructor(name, descriptor) {
		this.name = name;
		this.template = descriptor.template;
		this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		this.methods = descriptor.methods;
		this.init();
	}
	init() {
		new Observer(this.data);
		this.render();
		// new Compiler({
		// 	el: this.frag,
		// 	vm: Object.assign({})
		// });
	}
	render() {
		var frag = document.createDocumentFragment();
		var template = this.template;
		if (/^#/.test(template)) {
			var tempDom = document.querySelector(template);
			template = tempDom.innerHTML;
			tempDom.parentNode.removeChild(tempDom);
		}
		var div = document.createElement('div');
		div.innerHTML = template;
		[].slice.call(div.children).forEach(function(child) {
			frag.appendChild(child);
		});
		this.frag = frag;
	}
}

export default Component;