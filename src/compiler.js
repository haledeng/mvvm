import * as _ from './util';
import Watcher from './watcher';
import {
	vModel,
	vText,
	calculateExpression,
	setScopeValue
} from './directive';
class Compiler {
	constructor(opts) {
		this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
		this.$vm = opts.vm;
		this.init();
	}
	init() {
		this.traversalNode(this.$el);
	}
	traversalNode(node) {
		// 遍历节点
		var self = this;
		var elements = node.getElementsByTagName('*');
		elements = [].slice.call(elements);
		elements.forEach(function(element) {
			self.traversalAttribute(element);
			if (self.isTextNode(element)) {
				self.parseTextNode(element);
			}
		});
	}
	traversalAttribute(node) {
		var self = this;
		// 遍历属性
		var attrs = node.attributes;
		for (var i = 0; i < attrs.length; i++) {
			var item = attrs[i];
			if (/^v\-(\w*)/.test(item.name)) {
				self.bindWatch(self.$vm.$data, item.value, function(scope) {
					self._parseAttr(node, item);
				});
				this._parseAttr(node, item);
				this.addInputListener(node, item);
			}
		}
	}
	_parseAttr(node, attr) {
		// 转化属性
		var self = this;
		var attrReg = /^v\-(\w*)/;
		var matches = attr.name.match(attrReg);
		// var tagName = node.tagName.toLowerCase();
		var property = matches[1];
		switch (property) {
			// v-model
			case 'model':
				// if (tagName === 'input') {
				// 	node.value = self.$vm.$data[attr.value] || '';
				// } else if (tagName === 'textarea') {
				// 	node.innerHTML = this.$vm.$data[attr.value] || '';
				// }
				vModel(node, self.$vm.$data, attr.value);
				break;
				// v-text
			case 'text':
				vText(node, this.$vm.$data, attr.value);
				// node.innerHTML = this.$vm.$data[attr.value] || '';
				break;
			default:
				break;
		}
	}
	addInputListener(node, attr) {
		if (attr.name !== 'v-model') return;
		var key = attr.value;
		var oldVal = calculateExpression(this.$vm.$data, key);
		// var oldVal = this.$vm.$data[key];
		var self = this;
		// v-model监听
		node.addEventListener('input', function() {
			if (node.value != oldVal) {
				setScopeValue(self.$vm.$data, key, node.value);
				// self.$vm.$data[key] = node.value;
			}
		}, false);
	}
	isTextNode(node) {
		return node.children.length === 0 && node.childNodes.length !== 0;
	}
	bindWatch(vm, exp, callback) {
		var noop = function() {};
		new Watcher({
			vm: vm,
			exp: exp,
			callback: callback || noop
		});
	}
	parseTextNode(node) {
		var self = this;
		var html = node.innerHTML;
		var keys = [];
		const _replace = (scope) => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				if (!keys.length) {
					keys.push(name);
				}
				name = _.trim(name);
				return scope[name] || '';
			});
			node.innerHTML = newHtml;
		};
		_replace(this.$vm.$data);
		keys.forEach(function(key) {
			self.bindWatch(self.$vm.$data, key, _replace);
		});
	}
}

export default Compiler;