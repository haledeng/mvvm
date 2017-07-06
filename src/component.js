// import Compiler from './complier/complier';
import Observer from './observer/observer';
import * as _ from './util';
import {
	calculateExpression
} from './parser/expression';
import {
	parseForExpression
} from './parser/for';

import * as Dir from './directive/index';


// TODO: property compiler
var id = 0;
class Component {
	constructor(el, name, descriptor, vm) {
		this.el = el;
		this.uid = ++id;
		this.name = name;
		this.descriptor = descriptor;
		this.template = descriptor.template;
		// props生成的数据，不需要重复监听
		this.data = vm.$data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		// props中引用vm的数据，不监听
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.parent = descriptor.parent || null;
		this.children = [];
		this.$vm = vm;
		this.hasDir = false;
		this.init();
	}
	parseAttr() {
		let attrs = _.parseNodeAttr2Obj(this.el);
		var self = this;
		var node = this.el;
		for (var key in attrs) {
			var value = attrs[key];
			// directive
			if ((/^v\-([\w\:\']*)/.test(key)) && node.parentNode) {
				this.hasDir = true;
				// short name
				// v-on:event   @event
				// v-bind:property  :property
				var attrReg = /^v\-([\w\:\']*)/;
				var matches = key.match(attrReg);
				var property = matches[1];
				var watchExp = null;
				switch (property) {
					case 'for':
						var info = parseForExpression(value);
						// cache directive infomation
						node._forInfo = info;
						watchExp = info.val;
						self.$vm.bindDir(Object.assign({
							expression: value,
							name: property,
							watchExp: watchExp,
							context: self.$vm,
						}, Dir['v' + _.upperFirst(property)]), node);
						break;
					default:
						break;
				}
			}
		}
	}
	init() {
		new Observer(this.data);
		this.parseProps()
			.initComputed();
		_.proxyData(this.$vm, '$data');
		this.proxyMethods();
		this.parseAttr();
		if (this.hasDir) {
			this.frag = null;
		} else {
			this.render();
		}
	}
	render() {
		var self = this;
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
			_.copyPrivateAttr(self.el, child, property => /^\_/.test(property));
			frag.appendChild(child);
		});
		this.frag = frag;
	}
	initComputed() {
		var self = this;
		var computed = this.descriptor.computed;
		var keys = Object.keys(this.descriptor.computed);
		keys.forEach((m) => {
			self.data[m] = computed[m].call(self.data);
		});
		return this;
	}
	parseProps() {
		var props = Object.keys(this.descriptor.props);
		// var attrs = _.parseNodeAttr2Obj(this.el);
		var self = this;
		props.forEach((prop) => {
			var exp = this.el.getAttribute(prop);
			if (exp) {
				self.data[prop] = exp;
			} else {
				exp = this.el.getAttribute(':' + prop);
				exp && (self.data[prop] = calculateExpression(self.parent, exp));
			}

		});
		return self;

	}
	proxyMethods() {
		var methods = Object.keys(this.methods);
		var vm = this.$vm;
		methods.map((name) => {
			Object.defineProperty(vm, name, {
				configurable: true,
				enumerable: true,
				get: () => {
					return vm.methods[name];
				},
				set: _.noop
			});
		});
	}
}

export default Component;