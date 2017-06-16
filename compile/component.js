'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Compiler from './complier/complier';


var _observer = require('./observer/observer');

var _observer2 = _interopRequireDefault(_observer);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: property compiler
var id = 0;

var Component = function () {
	function Component(el, name, descriptor) {
		_classCallCheck(this, Component);

		this.el = el;
		this.uid = ++id;
		this.name = name;
		this.descriptor = descriptor;
		this.template = descriptor.template;
		// props生成的数据，不需要重复监听
		this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		// props中引用vm的数据，不监听
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.parent = descriptor.parent || null;
		this.init();
	}

	_createClass(Component, [{
		key: 'init',
		value: function init() {
			new _observer2.default(this.data);
			this.parseProps().initComputed().render();
		}
	}, {
		key: 'render',
		value: function render() {
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
			var attrs = _.parseNodeAttr2Obj(this.el);
			var self = this;
			props.forEach(function (prop) {
				var exp = _this.el.getAttribute(prop);
				if (exp) {
					self.data[prop] = exp;
				} else {
					exp = _this.el.getAttribute(':' + prop);
					exp && (self.data[prop] = self.parent[exp]);
				}
			});
			return self;
		}
	}]);

	return Component;
}();

exports.default = Component;