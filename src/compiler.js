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

// import vIf from './directive/if';
// import vHtml from './directive/html';
// import vBind from './directive/bind';

import {
	filter,
	parseFilter
} from './filter';

import CompilerMixin from './compiler_props';

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
			if (_.containOnlyTextNode(node)) {
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
			// v-for已经解析了其他的指定了，防止重复解析
			if (/^v\-([\w\:\']*)/.test(item.name) && node.parentNode) {
				this._parseAttr(node, item);
				this.addInputListener(node, item);
			}
		}
	}
	addInputListener(node, attr) {
		if (attr.name !== 'v-model') return;
		var key = attr.value;
		var oldVal = node.__value__;
		// var oldVal = parseExpression(this.$vm, key);
		var self = this;
		// v-model监听
		node.addEventListener('input', function() {
			if (node.value != oldVal) {
				setScopeValue(self.$vm.$data, key, node.value);
			}
		}, false);
	}
	bindWatch(vm, exp, callback, directive) {
		var noop = function() {};
		return new Watcher({
			vm: vm,
			exp: exp,
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
			if (!keys.length) {
				keys.push(name);
			}
		});

		// TODO: filters
		const _replace = (scope) => {
			var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function(all, name) {
				return watcherMaps[name].value;
			});
			node.textContent = newHtml;
		};
		// watcher会计算parseExpression，_replace中不单独计算，
		keys.forEach(function(key) {
			watcherMaps[key] = self.bindWatch(self.$vm, key, _replace);
		});
		_replace(this.$vm.$data);
	}
}


CompilerMixin(Compiler);


export default Compiler;