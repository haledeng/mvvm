'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _index = require('./directive/index');

var _filter = require('./filter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {
	function Compiler(opts) {
		_classCallCheck(this, Compiler);

		this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
		this.$vm = opts.vm;
		this.init();
	}

	_createClass(Compiler, [{
		key: 'init',
		value: function init() {

			this.traversalNode(this.$el);
		}
	}, {
		key: 'traversalNode',
		value: function traversalNode(node) {
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
						elements.forEach(function (element) {
							_traversal(element);
						});
					}
				}
			}
			_traversal(node);
		}
	}, {
		key: 'traversalAttribute',
		value: function traversalAttribute(node) {

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
	}, {
		key: '_parseAttr',
		value: function _parseAttr(node, attr) {
			// debugger;
			// 转化属性
			var self = this;
			var attrReg = /^v\-([\w\:\']*)/;
			var matches = attr.name.match(attrReg);
			var property = matches[1];
			var eventReg = /on\:(\w*)/;
			if (eventReg.test(property)) {
				var eventName = RegExp.$1;
				_index.vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
				// event handler
			} else {
				switch (property) {
					// v-model
					case 'model':
						// self.bindWatch(self.$vm.$data, attr.value, function() {
						// 	vModel(node, self.$vm.$data, attr.value);
						// });
						// vModel(node, self.$vm.$data, attr.value);


						self.bindWatch(self.$vm, attr.value, function () {
							(0, _index.vModel)(node, self.$vm, attr.value);
						});
						(0, _index.vModel)(node, self.$vm, attr.value);
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
						self.bindWatch(self.$vm, attr.value, function () {
							(0, _index.vText)(node, self.$vm, attr.value);
						});
						(0, _index.vText)(node, this.$vm, attr.value);
						break;
					case 'for':
						var info = (0, _index.parseForExpression)(attr.value);
						self.bindWatch(self.$vm, info.val, function () {
							(0, _index.vFor)(node, self.$vm, attr.value);
						});
						(0, _index.vFor)(node, this.$vm, attr.value);
					default:
						break;
				}
			}
		}
	}, {
		key: 'addInputListener',
		value: function addInputListener(node, attr) {
			if (attr.name !== 'v-model') return;
			var key = attr.value;
			var oldVal = (0, _index.parseExpression)(this.$vm, key);
			// var oldVal = this.$vm.$data[key];
			var self = this;
			// v-model监听
			node.addEventListener('input', function () {
				if (node.value != oldVal) {
					(0, _index.setScopeValue)(self.$vm.$data, key, node.value);
					// self.$vm.$data[key] = node.value;
				}
			}, false);
		}
	}, {
		key: 'isTextNode',
		value: function isTextNode(node) {
			return node.children.length === 0 && node.childNodes.length !== 0;
		}
	}, {
		key: 'bindWatch',
		value: function bindWatch(vm, exp, callback) {
			var noop = function noop() {};
			new _watcher2.default({
				vm: vm,
				exp: exp,
				callback: callback || noop
			});
		}
	}, {
		key: 'parseTextNode',
		value: function parseTextNode(node) {
			var self = this;
			var html = node.innerHTML;
			var keys = [];

			// TODO: filters
			var _replace = function _replace(scope) {
				var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
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

					return (0, _index.parseExpression)(self.$vm, name);
					// return scope[name] !== undefined ? scope[name] : 0;
				});
				node.innerHTML = newHtml;
			};
			_replace(this.$vm.$data);
			keys.forEach(function (key) {
				self.bindWatch(self.$vm, key, _replace);
			});
		}
	}]);

	return Compiler;
}();

exports.default = Compiler;