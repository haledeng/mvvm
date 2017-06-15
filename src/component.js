// import Compiler from './complier/complier';
import Observer from './observer/observer';


// TODO: property compiler
var id = 0;
class Component {
	constructor(name, descriptor) {
		this.uid = ++id;
		this.name = name;
		this.descriptor = descriptor;
		this.template = descriptor.template;
		// props生成的数据，不需要重复监听
		this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		// props中引用vm的数据，不监听
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.parent = descriptor.parent || null;
		this.init();
	}
	init() {
		new Observer(this.data);
		this.render();
	}
	render() {
		// component template.
		var frag = document.createDocumentFragment();
		// template ID
		var template = this.template;
		if (/^#/.test(template)) {
			var tempDom = document.querySelector(template);
			template = tempDom.innerHTML;
			// remove template DOM from Document.
			tempDom.parentNode.removeChild(tempDom);
			// record finally component template
			this.descriptor.template = template;
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