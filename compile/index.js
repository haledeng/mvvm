'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MVVM = undefined;

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _observer = require('./observer');

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * entry
                                                                                                                                                           */

var MVVM = function MVVM(options) {
	_classCallCheck(this, MVVM);

	this.$data = options.data || {};
	this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el || document.body;
	this.methods = options.methods;
	this.filters = options.filters || {};
	new _observer2.default(this.$data);
	new _compiler2.default({
		el: this.$el,
		vm: this
	});
};

exports.MVVM = MVVM;