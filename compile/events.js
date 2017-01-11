"use strict";

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
		var self = this;
		var fns = this._events[name];
		fns.forEach(function (fn) {
			fn.call(self);
		});
	};
};