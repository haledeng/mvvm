// import Compiler from './complier/complier';
import Observer from './observer/observer';
import * as _ from './util';

var id = 0;
class Component {
	constructor(name, descriptor) {
		this.uid = ++id;
		this.name = name;
		this.template = descriptor.template;
		// props生成的数据，不需要重复监听
		this._desData = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		if (_.isType(descriptor._data, 'object')) {
			this.data = _.mixin(descriptor._data, this._desData);
		}
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.init();
	}
	init() {
		// 重复监听
		new Observer(this.data);
		// new Observer(this._desData);
		// observe(this.data);
		this.render();
	}
	render() {
		var frag = document.createDocumentFragment();
		// template ID
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