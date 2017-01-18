// import Compiler from './complier/complier';
import Observer from './observer/observer';
import * as _ from './util';
var id = 0;
class Component {
	constructor(name, descriptor) {
		this.uid = ++id;
		this.name = name;
		this.template = descriptor.template;
		this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		if (_.isType(descriptor._data, 'object')) {
			this.data = _.mixin(descriptor._data, this.data);
		}
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.init();
	}
	init() {
		new Observer(this.data);
		this.render();
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
		frag.uid = id;
	}
}

export default Component;