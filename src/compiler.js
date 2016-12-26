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

		// 遍历节点
		var self = this;
		var elements = node.getElementsByTagName('*');
		elements = [].slice.call(elements);
		elements.unshift(node);
		elements.forEach(function(element) {
			self.traversalAttribute(element);
			// 模板不编译
			if (self.isTextNode(element) && !element.__template__) {
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
					// self.bindWatch(self.$vm.$data, attr.value, function() {
					// 	vModel(node, self.$vm.$data, attr.value);
					// });
					// vModel(node, self.$vm.$data, attr.value);


					self.bindWatch(self.$vm, attr.value, function() {
						vModel(node, self.$vm, attr.value);
					});
					vModel(node, self.$vm, attr.value);
					break;
					// v-text
				case 'text':
					// filters
					// TODO: watcher 中计算表达式有问题
					// watch 表达式，还是表达式中的变量
					// self.bindWatch(self.$vm.$data, attr.value, function() {
					// 	vText(node, self.$vm.$data, attr.value);
					// });
					// vText(node, this.$vm.$data, attr.value);
					self.bindWatch(self.$vm, attr.value, function() {
						vText(node, self.$vm, attr.value);
					});
					vText(node, this.$vm, attr.value);
					break;
				case 'for':
					var info = parseForExpression(attr.value);
					self.bindWatch(self.$vm.$data, info.val, function() {
						vFor(node, self.$vm.$data, attr.value);
					});
					vFor(node, this.$vm.$data, attr.value);
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
		// TODO: filters
		const _replace = (scope) => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				// var rets = parseFilter(name);
				// if (rets) {
				// 	// 计算参数的值
				// 	var paramValue = calculateExpression(scope, rets.param);
				// 	return filter.apply(null, [self.$vm, rets.method, paramValue].concat(rets.args))

				// }
				if (!keys.length) {
					keys.push(name);
				}
				// name = _.trim(name);
				// return calculateExpression(scope, name);

				return parseExpression(self.$vm, name);
				// return scope[name] !== undefined ? scope[name] : 0;
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