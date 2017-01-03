'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // custom directive

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export default function(MVVM) {
// 	/**
// 	 * define custom directive
// 	 * @param  {string} name  directive name
// 	 * @param  {object} hooks directive hooks
// 	 * @return {[type]}       [description]
// 	 */
// 	*
// 	 * hooks functions may be following:
// 	 * http://vuejs.org/v2/guide/custom-directive.html

// 	MVVM.directive = function(name, hooks) {
// 		if (typeof name !== 'string') return;
// 		if (!this._directives) {
// 			this._directives = {};
// 		}
// 		if (!this._directives[name]) {
// 			this._directives[name] = hooks;
// 		}
// 	}
// }

function noop() {};

var Directive = function () {
	function Directive(descriptor, vm, node) {
		_classCallCheck(this, Directive);

		this.descriptor = descriptor;
		this.bind = descriptor.bind || noop;
		this.update = descriptor.update || noop;
		this.expression = descriptor.expression;
		this.$el = node;
		this.$vm = vm;
		this.name = descriptor.name;
		this._bind();
	}

	_createClass(Directive, [{
		key: '_bind',
		value: function _bind() {
			var self = this;
			if (this.bind) {
				this.bind();
			}
			if (this.update) {
				this._watcher = new _watcher2.default({
					vm: this.$vm,
					exp: this.expression,
					callback: function callback(vm, value, oldValue) {
						self.update(value);
					}
				});

				this.update(this._watcher.value);
			}
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			this.$vm.$data[key] = value;
		}
	}]);

	return Directive;
}();

exports.default = Directive;