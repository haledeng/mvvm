'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 抽象所有directive的行为
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 1. directive的lifecycle： bind, update, unbind
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _watcher = require('./observer/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Directive = function () {
	function Directive(descriptor, vm, node) {
		_classCallCheck(this, Directive);

		this.descriptor = descriptor;
		_.mixin(this, this.descriptor);
		this.bind = descriptor.bind || _.noop;
		this.update = descriptor.update || _.noop;
		this.watchExp = descriptor.watchExp || descriptor.expression;
		this.$el = node;
		this.$vm = vm;
		// bind, on等后面跟的事件名或属性名
		this.extraName = descriptor.extraName || descriptor.name;
		this._bind();
	}

	_createClass(Directive, [{
		key: '_bind',
		value: function _bind() {
			var self = this;
			if (typeof this.bind === 'function') {
				this.bind();
			}
			// 事件不需要update
			if (this.name === 'on') return;
			if ('function' === typeof this.update) {
				this._watcher = new _watcher2.default({
					vm: self.$vm,
					$el: self.$el,
					exp: self.watchExp,
					directive: this.name,
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