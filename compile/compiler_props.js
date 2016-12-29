'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {
	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function (node, attr) {
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var eventReg = /on\:(\w*)/;
		var bindReg = /bind\:(\w*)/;
		if (eventReg.test(property)) {
			var eventName = RegExp.$1;
			_on2.default.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
			// event handler
		} else if (bindReg.test(property)) {
			var bindProperty = RegExp.$1;
			self.bindWatch(self.$vm, attr.value, function () {
				_bind2.default.call(self.$vm.$data, node, self.$vm, attr.value, bindProperty);
			}, 'bind');
			// TODO: watcher
			_bind2.default.call(this.$vm.$data, node, this.$vm, attr.value, bindProperty);
		} else {
			switch (property) {
				// v-model
				case 'model':
					self.bindWatch(self.$vm, attr.value, function () {
						(0, _model2.default)(node, self.$vm, attr.value);
					}, 'model');
					(0, _model2.default)(node, self.$vm, attr.value);
					break;
				// v-text
				case 'text':
					// filters
					self.bindWatch(self.$vm, attr.value, function () {
						(0, _text2.default)(node, self.$vm, attr.value);
					}, 'text');
					(0, _text2.default)(node, this.$vm, attr.value);
					break;
				case 'html':
					self.bindWatch(self.$vm, attr.value, function () {
						(0, _html2.default)(node, self.$vm, attr.value);
					}, 'html');
					(0, _html2.default)(node, this.$vm, attr.value);
					break;
				case 'for':
					var info = (0, _for4.default)(attr.value);
					self.bindWatch(self.$vm, info.val, function () {
						(0, _for2.default)(node, self.$vm, attr.value);
					}, 'for');
					(0, _for2.default)(node, this.$vm, attr.value);
					break;
				case 'if':
					// parse expression
					self.bindWatch(self.$vm, attr.value, function () {
						(0, _if2.default)(node, self.$vm, attr.value);
					}, 'if');
					(0, _if2.default)(node, this.$vm, attr.value);
					break;
				default:
					break;
			}
		}
	};
};

var _model = require('./directive/model');

var _model2 = _interopRequireDefault(_model);

var _text = require('./directive/text');

var _text2 = _interopRequireDefault(_text);

var _on = require('./directive/on');

var _on2 = _interopRequireDefault(_on);

var _bind = require('./directive/bind');

var _bind2 = _interopRequireDefault(_bind);

var _html = require('./directive/html');

var _html2 = _interopRequireDefault(_html);

var _for = require('./directive/for');

var _for2 = _interopRequireDefault(_for);

var _if = require('./directive/if');

var _if2 = _interopRequireDefault(_if);

var _for3 = require('./parser/for');

var _for4 = _interopRequireDefault(_for3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }