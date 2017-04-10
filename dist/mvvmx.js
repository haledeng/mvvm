(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var applyMixin = function applyMixin() {
		var _init = MVVM.prototype.init;
		MVVM.prototype.init = function (options) {
			options.init = options.init ? options.init.push(mvvmxInit) : [mvvmxInit];
			_init.call(this, options);
		};
	};

	function mvvmxInit() {
		var options = this.$options;
		if (options.store) {
			this.$data.$store = options.store;
		}
	}

	var devPlugins = [];

	function Store(options) {
		var self = this;
		this.state = options.state;
		var plugins = options.plugins || [];
		this._subscribers = [];
		this._mutations = options.mutations || Object.create(null);

		plugins.concat(devPlugins).forEach(function (plugin) {
			return plugin(self);
		});
	}

	var _proto_ = Store.prototype;

	_proto_.subscribe = function (fn) {
		var subs = this._subscribers;
		if (subs.indexOf(fn) === -1) {
			subs.push(fn);
		}
		return function (i) {
			return function () {
				if (i > -1) {
					subs.splice(i, 1);
				}
			};
		}(subs.length - 1);
	};

	_proto_.commit = function (action, data) {
		if (!action) return;
		var self = this;
		var mutations = this._mutations,
		    mutation = mutations[action];
		if (typeof mutation === 'function') {
			mutation.call(self, self.state, data);
			this._subscribers.forEach(function (sub) {
				sub.call(self, mutation, self.state);
			});
		}
	};

	var MVVMX = {

		Store: Store
	};

	applyMixin();

	exports.MVVMX = MVVMX;

/***/ }
/******/ ])
});
;