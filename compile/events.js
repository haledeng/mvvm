'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Lib) {
	Lib.prototype.$on = function (name, callback) {
		if (!this._events) {
			this._events = {};
		}
		(this._events[name] || (this._events[name] = [])).push(callback);
	};

	Lib.prototype.$emit = function (name) {
		var args = [].slice.call(arguments, 1);
		var self = this;
		var fns = this._events[name];
		if (_.isType(fns, 'array')) {
			fns.forEach(function (fn) {
				fn.apply(self.$data, args);
			});
		} else if (_.isType(fns, 'function')) {
			fns.apply(self.$data, args);
		}
	};

	Lib.prototype.$broadcast = function () {
		var children = this.$children;
		var shouldPropagate = false;
		var args = arguments;
		children.forEach(function (child) {
			shouldPropagate = child.$emit.apply(child, args);
			// if (shouldPropagate) {
			// 	child.$broadcast.apply(child, arguments);
			// }
		});
	};
};

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }