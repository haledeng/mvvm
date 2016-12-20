'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
	function Watcher() {
		_classCallCheck(this, Watcher);
	}

	_createClass(Watcher, [{
		key: 'on',
		value: function on(name, callback) {
			if (typeof callback === 'function') {
				if (!Watcher._evMaps[name]) {
					Watcher._evMaps[name] = [];
				}
				Watcher._evMaps[name].push(callback);
			}
		}
	}, {
		key: 'off',
		value: function off(name, callback) {}
	}, {
		key: 'emit',
		value: function emit(name) {
			var callbacks = Watcher._evMaps[name];
			var args = [].slice.call(arguments, 1);
			callbacks.forEach(function (callback) {
				callback(args);
			});
		}
	}]);

	return Watcher;
}();

Watcher._evMaps = {};
exports.default = Watcher;