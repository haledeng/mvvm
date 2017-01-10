'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function (node, attr) {
		var customDirectives = this.$vm.constructor._cusDirectives || {};
		var customNames = Object.keys(customDirectives);
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var bindOn = /(on|bind)\:(\w*)/;
		if (bindOn.test(property)) {
			self.$vm.bindDir(Object.assign({
				expression: attr.value,
				name: RegExp.$1,
				extraName: RegExp.$2,
				context: self.$vm
			}, Dir['v' + _.upperFirst(RegExp.$1)]), node);
		} else {
			switch (property) {
				// v-model
				case 'model':
				case 'text':
				case 'html':
				case 'if':
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						name: property
					}, Dir['v' + _.upperFirst(property)]), node);
					break;
				case 'for':
					var info = (0, _for.parseForExpression)(attr.value);
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						watchExp: info.val,
						name: property
					}, Dir['v' + _.upperFirst(property)]), node);
					break;
				default:
					if (~customNames.indexOf(property)) {
						self.$vm.bindDir(Object.assign({
							expression: attr.value,
							name: property
						}, customDirectives[property]), node);
					}
					break;
			}
		}
	};
};

var _for = require('../parser/for');

var _index = require('../directive/index');

var Dir = _interopRequireWildcard(_index);

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }