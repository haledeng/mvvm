'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Compiler from './complier/complier';


var _observer = require('./observer/observer');

var _observer2 = _interopRequireDefault(_observer);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _expression = require('./parser/expression');

var _for = require('./parser/for');

var _index = require('./directive/index');

var Dir = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: property compiler
var id = 0;

var Component = function () {
	function Component(el, name, descriptor, vm) {
		_classCallCheck(this, Component);

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

	_createClass(Component, [{
		key: 'parseAttr',
		value: function parseAttr() {
			var attrs = _.parseNodeAttr2Obj(this.el);
			var self = this;
			var node = this.el;
			for (var key in attrs) {
				var value = attrs[key];
				// directive
				if (/^v\-([\w\:\']*)/.test(key) && node.parentNode) {
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
							var info = (0, _for.parseForExpression)(value);
							// cache directive infomation
							node._forInfo = info;
							watchExp = info.val;
							self.$vm.bindDir(Object.assign({
								expression: value,
								name: property,
								watchExp: watchExp,
								context: self.$vm
							}, Dir['v' + _.upperFirst(property)]), node);
							break;
						default:
							break;
					}
				}
			}
		}
	}, {
		key: 'init',
		value: function init() {
			new _observer2.default(this.data);
			this.parseProps().initComputed();
			_.proxyData(this.$vm, '$data');
			this.proxyMethods();
			this.parseAttr();
			if (this.hasDir) {
				this.frag = null;
			} else {
				this.render();
			}
		}
	}, {
		key: 'render',
		value: function render() {
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
			[].slice.call(div.children).forEach(function (child) {
				_.copyPrivateAttr(self.el, child, function (property) {
					return (/^\_/.test(property)
					);
				});
				frag.appendChild(child);
			});
			this.frag = frag;
		}
	}, {
		key: 'initComputed',
		value: function initComputed() {
			var self = this;
			var computed = this.descriptor.computed;
			var keys = Object.keys(this.descriptor.computed);
			keys.forEach(function (m) {
				self.data[m] = computed[m].call(self.data);
			});
			return this;
		}
	}, {
		key: 'parseProps',
		value: function parseProps() {
			var _this = this;

			var props = Object.keys(this.descriptor.props);
			// var attrs = _.parseNodeAttr2Obj(this.el);
			var self = this;
			props.forEach(function (prop) {
				var exp = _this.el.getAttribute(prop);
				if (exp) {
					self.data[prop] = exp;
				} else {
					exp = _this.el.getAttribute(':' + prop);
					exp && (self.data[prop] = (0, _expression.calculateExpression)(self.parent, exp));
				}
			});
			return self;
		}
	}, {
		key: 'proxyMethods',
		value: function proxyMethods() {
			var methods = Object.keys(this.methods);
			var vm = this.$vm;
			methods.map(function (name) {
				Object.defineProperty(vm, name, {
					configurable: true,
					enumerable: true,
					get: function get() {
						return vm.methods[name];
					},
					set: _.noop
				});
			});
		}
	}]);

	return Component;
}();

exports.default = Component;