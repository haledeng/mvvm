import * as _ from './util';
import Watcher from './watcher';
import {
	vModel,
	vText,
	calculateExpression,
	setScopeValue,
	vOn,
	vFor,
	parseForExpression,
	parseExpression
} from './directive/index';

import {
	filter,
	parseFilter
} from './filter';

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
		// elements应该是动态变化的
		// 遍历方式有问题
		// 遍历节点
		var self = this;
		// var elements = node.getElementsByTagName('*');
		// elements = [].slice.call(elements);
		// elements.unshift(node);
		// elements.forEach(function(element) {
		// 	self.traversalAttribute(element);
		// 	// 模板不编译
		// 	if (self.isTextNode(element) && !element.__template__) {
		// 		self.parseTextNode(element);
		// 	}
		// 	// TODO: removeChild后，elements需要重新获取
		// });

		function _traversal(node) {
			self.traversalAttribute(node);
			if (self.isTextNode(node)) {
				self.parseTextNode(node);
			} else {
				// node has been removed
				if (node.parentNode) {
					var elements = node.children;
					elements = [].slice.call(elements);
					elements.forEach(function(element) {
						_traversal(element);
					});
				}
			}
		}
		_traversal(node);
	}
	traversalAttribute(node) {
		var self = this;
		// 遍历属性
		var attrs = node.attributes;
		for (var i = 0; i < attrs.length; i++) {
			var item = attrs[i];
			if (/^v\-([\w\:\']*)/.test(item.name)) {
				this._parseAttr(node, item);
				this.addInputListener(node, item);
			}
		}
	}
	_parseAttr(node, attr) {
		// debugger;
		// 转化属性
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var eventReg = /on\:(\w*)/;
		if (eventReg.test(property)) {
			var eventName = RegExp.$1;
			vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
			// event handler
		} else {
			switch (property) {
				// v-model
				case 'model':
					self.bindWatch(self.$vm, attr.value, function() {
						vModel(node, self.$vm, attr.value);
					});
					vModel(node, self.$vm, attr.value);
					break;
					// v-text
				case 'text':
					// filters
					self.bindWatch(self.$vm, attr.value, function() {
						vText(node, self.$vm, attr.value);
					});
					vText(node, this.$vm, attr.value);
					break;
				case 'for':
					var info = parseForExpression(attr.value);
					self.bindWatch(self.$vm, info.val, function() {
						vFor(node, self.$vm, attr.value);
					});
					vFor(node, this.$vm, attr.value);
				default:
					break;
			}
		}
	}
	addInputListener(node, attr) {
		if (attr.name !== 'v-model') return;
		var key = attr.value;
		var oldVal = parseExpression(this.$vm, key);
		// var oldVal = this.$vm.$data[key];
		var self = this;
		// v-model监听
		node.addEventListener('input', function() {
			if (node.value != oldVal) {
				setScopeValue(self.$vm.$data, key, node.value);
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

		// TODO: filters
		const _replace = (scope) => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				if (!keys.length) {
					keys.push(name);
				}
				return parseExpression(self.$vm, name);
			});
			node.innerHTML = newHtml;
		};
		_replace(this.$vm.$data);
		keys.forEach(function(key) {
			self.bindWatch(self.$vm, key, _replace);
		});
	}
}

export default Compiler;