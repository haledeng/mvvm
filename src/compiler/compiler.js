import * as _ from '../util';
import Watcher from '../observer/watcher';
import {
	vModel,
	vText,
	vOn,
	vFor,
} from '../directive/index';

import {
	calculateExpression
} from '../parser/expression';

import CompilerMixin from './compiler_props';
import ComponentMixin from './compiler_component';


class Compiler {
	constructor(opts) {
		this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
		this.$vm = opts.vm;
		this.traversalNode(this.$el);
	}
	traversalNode(node) {
		// elements应该是动态变化的
		// 遍历方式有问题
		// 遍历节点
		var self = this;

		function _traversal(node) {
			self.traversalAttribute(node);
			self.parseCustomComponent(node);
			if ((node.parentNode || node.nodeType == 11) && _.containOnlyTextNode(node)) {
				self.parseTextNode(node);
			} else {
				// node has been removed
				if (node.parentNode || node.nodeType == 11) {
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
	parseCustomComponent(node) {
		if (!node.tagName) return;
		var tagName = node.tagName.toLowerCase();
		var globalComonent = this.$vm.constructor._globalCom || {};
		var comNames = Object.keys(globalComonent);
		if (~comNames.indexOf(tagName)) {
			this._parseComponent(node);
		}
	}
	traversalAttribute(node) {
		var self = this;
		// 遍历属性
		var attrs = node.attributes || [];
		var dirs = [];
		for (var i = 0; i < attrs.length; i++) {
			var item = attrs[i];
			// v-for已经解析了其他的directive了，防止重复解析
			// /(v\-\w*)?(\:|\@)/
			if ((/^v\-([\w\:\']*)/.test(item.name) || /^[\:\@]/.test(item.name)) && node.parentNode) {
				this._parseAttr(node, item);
				dirs.push(item.name);
			}
			// 属性值是模板表达式
			if (/^\{\{/.test(item.value) && /\}\}$/.test(item.value)) {
				var name = item.value.replace(/^\{\{/, '').replace(/\}\}$/, '');
				node.setAttribute(item.name, calculateExpression(self.$vm.$data, name))
			}
		}
		// remove all directives
		dirs.forEach(function(dir) {
			node.removeAttribute(dir);
		});

	}
	bindWatch(node, vm, exp, callback, directive) {
		var noop = function() {};
		return new Watcher({
			vm: vm,
			exp: exp,
			$el: node,
			directive: directive || '',
			callback: callback || noop
		});
	}
	parseTextNode(node) {
		var self = this;
		var html = node.textContent;
		var keys = [];
		var watcherMaps = {};

		html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
			if (keys.indexOf(name) === -1) {
				keys.push(name);
			}
		});

		const _replace = (scope) => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				return watcherMaps[name].value;
			});
			node.textContent = newHtml;
		};
		// watcher会计算parseExpression，_replace中不单独计算，
		keys.forEach(function(key) {
			watcherMaps[key] = self.bindWatch(node, self.$vm, key, _replace);
		});
		_replace();
	}
}


CompilerMixin(Compiler);
ComponentMixin(Compiler);

export default Compiler;