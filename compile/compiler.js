'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// import vIf from './directive/if';
// import vHtml from './directive/html';
// import vBind from './directive/bind';

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _index = require('./directive/index');

var _filter = require('./filter');

var _compiler_props = require('./compiler_props');

var _compiler_props2 = _interopRequireDefault(_compiler_props);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {
	function Compiler(opts) {
		_classCallCheck(this, Compiler);

		this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
		this.$vm = opts.vm;
		this.traversalNode(this.$el);
	}

	_createClass(Compiler, [{
		key: 'traversalNode',
		value: function traversalNode(node) {
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
				// v-for已经解析了其他的指定了，防止重复解析
				if (/^v\-([\w\:\']*)/.test(item.name) && node.parentNode) {
					this._parseAttr(node, item);
					this.addInputListener(node, item);
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
				}
			}, false);
		}
	}, {
		key: 'bindWatch',
		value: function bindWatch(vm, exp, callback, directive) {
			var noop = function noop() {};
			new _watcher2.default({
				vm: vm,
				exp: exp,
				directive: directive || '',
				callback: callback || noop
			});
		}
	}, {
		key: 'parseTextNode',
		value: function parseTextNode(node) {
			var self = this;
			var html = node.textContent;
			var keys = [];

			// TODO: filters
			var _replace = function _replace(scope) {
				var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
					if (!keys.length) {
						keys.push(name);
					}
					return (0, _index.parseExpression)(self.$vm, name);
				});
				node.textContent = newHtml;
			};
			_replace(this.$vm.$data);
			keys.forEach(function (key) {
				self.bindWatch(self.$vm, key, _replace);
			});
		}
	}]);

	return Compiler;
}();

(0, _compiler_props2.default)(Compiler);

exports.default = Compiler;