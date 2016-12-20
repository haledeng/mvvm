'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = function () {
	function Observer(data) {
		_classCallCheck(this, Observer);

		this.$data = data;
		this.addObserverForAllProperty();
		this.$watcher = new _watcher2.default();
	}

	_createClass(Observer, [{
		key: 'addObserverForAllProperty',
		value: function addObserverForAllProperty() {
			for (var key in this.$data) {
				if (this.$data.hasOwnProperty(key)) {
					this.addObserver(this.$data, key, this.$data[key]);
				}
			}
		}
	}, {
		key: 'addObserver',
		value: function addObserver(data, key, val) {
			var self = this;
			Object.defineProperty(data, key, {
				configurable: false,
				enumerable: true,
				set: function set(newVal) {
					val = newVal;
					self.$watcher.emit(key, newVal);
					// update;
				},
				get: function get() {
					return val;
				}
			});
		}
	}]);

	return Observer;
}();

exports.default = Observer;