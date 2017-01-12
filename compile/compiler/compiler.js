'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _watcher = require('../observer/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _index = require('../directive/index');

var _filter = require('../filter');

var _compiler_props = require('./compiler_props');

var _compiler_props2 = _interopRequireDefault(_compiler_props);

var _compiler_component = require('./compiler_component');

var _compiler_component2 = _interopRequireDefault(_compiler_component);

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
				self.parseCustomComponent(node);
				if ((node.parentNode || node.nodeType == 11) && _.containOnlyTextNode(node)) {
					self.parseTextNode(node);
				} else {
					// node has been removed
					if (node.parentNode || node.nodeType == 11) {
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
		key: 'parseCustomComponent',
		value: function parseCustomComponent(node) {
			if (!node.tagName) return;
			var tagName = node.tagName.toLowerCase();
			var globalComonent = this.$vm.constructor._globalCom || {};
			var comNames = Object.keys(globalComonent);
			if (~comNames.indexOf(tagName)) {
				this._parseComponent(node);
			}
		}
	}, {
		key: 'traversalAttribute',
		value: function traversalAttribute(node) {
			var self = this;
			// 遍历属性
			var attrs = node.attributes || [];
			var dirs = [];
			for (var i = 0; i < attrs.length; i++) {
				var item = attrs[i];
				// v-for已经解析了其他的指定了，防止重复解析
				if (/^v\-([\w\:\']*)/.test(item.name) && node.parentNode) {
					this._parseAttr(node, item);
					dirs.push(item.name);
				}
			}

			// remove all directives
			dirs.forEach(function (dir) {
				node.removeAttribute(dir);
			});
		}
	}, {
		key: 'bindWatch',
		value: function bindWatch(vm, exp, callback, directive) {
			var noop = function noop() {};
			return new _watcher2.default({
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
			var watcherMaps = {};

			html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
				console.log(name);
				if (keys.indexOf(name) === -1) {
					keys.push(name);
				}
			});

			// TODO: filters
			var _replace = function _replace(scope) {
				var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
					return watcherMaps[name].value;
				});
				node.textContent = newHtml;
			};
			// watcher会计算parseExpression，_replace中不单独计算，
			keys.forEach(function (key) {
				watcherMaps[key] = self.bindWatch(self.$vm, key, _replace);
			});
			_replace(this.$vm.$data);
		}
	}]);

	return Compiler;
}();

(0, _compiler_props2.default)(Compiler);
(0, _compiler_component2.default)(Compiler);

exports.default = Compiler;