import * as _ from './util';
import Watcher from './watcher';
class Compiler {
	constructor(opts) {
		this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
		this.$vm = opts.vm;
		this.$watcher = new Watcher();
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
				this.$watcher.on(item.value, function() {
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
		var tagName = node.tagName.toLowerCase();
		var property = matches[1];
		switch (property) {
			// v-model
			case 'model':
				if (tagName === 'input') {
					node.value = self.$vm.$data[attr.value] || '';
				} else if (tagName === 'textarea') {
					node.innerHTML = this.$vm.$data[attr.value] || '';
				}
				break;
				// v-text
			case 'text':
				node.innerHTML = this.$vm.$data[attr.value] || '';
				break;
			default:
				break;
		}
	}
	addInputListener(node, attr) {
		if (attr.name !== 'v-model') return;
		var key = attr.value;
		var oldVal = this.$vm.$data[key];
		var self = this;
		// v-model监听
		node.addEventListener('change', function() {

		}, false);
		node.addEventListener('keyup', function() {
			if (node.value != oldVal) {
				self.$vm.$data[key] = node.value;
			}
		}, false);
	}
	isTextNode(node) {
		return node.children.length === 0 && node.childNodes.length !== 0;
	}
	parseTextNode(node) {
		var self = this;
		var html = node.innerHTML;
		var keys = [];
		const _replace = () => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				if (!keys.length) {
					keys.push(name);
				}
				name = _.trim(name);
				return self.$vm.$data[name] || '';
			});
			node.innerHTML = newHtml;
		}
		_replace();
		keys.forEach(function(key) {
			self.$watcher.on(key, function() {
				_replace();
			});
		});
	}
}

export default Compiler;