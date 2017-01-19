'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {

	function parseBindOn(str) {
		if (/^@/.test(str)) {
			return 'on';
		}
		if (/^\:/.test(str)) {
			return 'bind';
		}
		return str.replace(/\:$/, '');
	}

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function (node, attr) {
		var customDirectives = this.$vm.constructor._cusDirectives || {};
		var customNames = Object.keys(customDirectives);
		var self = this;
		// var bindOn = /(on|bind)\:(\w*)/;
		var bindOn = /(v\-on\:|v\-bind\:|@|\:)(\w*)/;
		// v-on:event   @event
		// v-bind:property  :property
		if (bindOn.test(attr.name)) {
			var extraName = RegExp.$2;
			var directiveName = parseBindOn(RegExp.$1);
			self.$vm.bindDir(Object.assign({
				expression: attr.value,
				name: directiveName,
				extraName: extraName,
				context: self.$vm
			}, Dir['v' + _.upperFirst(directiveName)]), node);
		} else {
			var attrReg = /^v\-([\w\:\']*)/;
			var matches = attr.name.match(attrReg);
			var property = matches[1];
			switch (property) {
				// v-model
				case 'model':
				case 'text':
				case 'html':
				case 'show':
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
					// custom directives
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