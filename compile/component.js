'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import Compiler from './complier/complier';


var _observer = require('./observer/observer');

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var id = 0;

var Component = function () {
	function Component(name, descriptor) {
		_classCallCheck(this, Component);

		this.uid = ++id;
		this.name = name;
		this.descriptor = descriptor;
		this.template = descriptor.template;
		// props生成的数据，不需要重复监听
		this.data = typeof descriptor.data === 'function' ? descriptor.data() : descriptor.data;
		// props中引用vm的数据，不监听
		this.methods = descriptor.methods;
		this.events = descriptor.events;
		this.init();
	}

	_createClass(Component, [{
		key: 'init',
		value: function init() {
			new _observer2.default(this.data);
			this.render();
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
	}]);

	return Component;
}();

exports.default = Component;