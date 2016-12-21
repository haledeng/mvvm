'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _depender = require('./depender');

var _depender2 = _interopRequireDefault(_depender);

var _directive = require('./directive');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *	事件监听的方式来处理
 */
// class Watcher {
// 	constructor() {

// 	}
// 	on(name, callback) {
// 		if (typeof callback === 'function') {
// 			if (!Watcher._evMaps[name]) {
// 				Watcher._evMaps[name] = [];
// 			}
// 			Watcher._evMaps[name].push(callback);
// 		}
// 	}
// 	off(name) {
// 		if (Watcher._evMaps[name]) {
// 			delete Watcher._evMaps[name];
// 		}
// 	}
// 	emit(name) {
// 		var callbacks = Watcher._evMaps[name];
// 		var args = [].slice.call(arguments, 1);
// 		callbacks.forEach(function(callback) {
// 			callback(args);
// 		});
// 	}
// }
// Watcher._evMaps = {};
var uid = 0;

var Watcher = function () {
	function Watcher(opts) {
		_classCallCheck(this, Watcher);

		this.id = uid++;
		this.vm = opts.vm;
		this.exp = opts.exp;
		this.callback = opts.callback;
		this.value = this.get();
	}

	_createClass(Watcher, [{
		key: 'update',
		value: function update() {
			var newVal = this.get();
			var oldVal = this.value;
			if (oldVal != newVal) {
				this.value = newVal;
				// this.callback.call(this.vm, newVal, oldVal);
				this.callback(this.vm, newVal, oldVal);
			}
		}
	}, {
		key: 'get',
		value: function get() {
			_depender2.default.target = this;
			// var value = this.vm[this.exp];
			var value = (0, _directive.calculateExpression)(this.vm, this.exp);
			_depender2.default.target = null;
			return value;
		}
	}]);

	return Watcher;
}();

exports.default = Watcher;