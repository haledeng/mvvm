'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // custom directive

exports.default = function (MVVM) {
	/**
  * define custom directive
  * @param  {string} name  directive name
  * @param  {object} hooks directive hooks
  * @return {[type]}       [description]
  */
	/**
  * hooks functions may be following:
  * http://vuejs.org/v2/guide/custom-directive.html
  */
	MVVM.directive = function (name, hooks) {
		if (typeof name !== 'string') return;
		if (!this.__customDirectives__) {
			this.__customDirectives__ = {};
		}
		if (!this.__customDirectives__[name]) {
			this.__customDirectives__[name] = hooks;
		}
	};
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function noop() {};

var directive = function () {
	function directive(descriptor, vm, node) {
		_classCallCheck(this, directive);

		this.bind = descriptor.bind || noop;
		this.update = descriptor.update || noop;
	}

	_createClass(directive, [{
		key: '_bind',
		value: function _bind() {}
	}]);

	return directive;
}();