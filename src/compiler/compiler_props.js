import {
	parseForExpression
} from '../parser/for';

import * as Dir from '../directive/index';
import * as _ from '../util';


/**
 * 编译directive
 * v-for, v-model, v-text, v-html, v-bind, v-on, v-if
 * 自定义指令
 */
export default function(Compiler) {

	function parseBindOn(str) {
		// @event
		if (/^@/.test(str)) {
			return 'on';
		}
		// :bindProperty
		if (/^\:/.test(str)) {
			return 'bind';
		}
		// v-on:  v-bind:
		return str.replace(/^v\-|\:$/g, '');
	}

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function(node, attr) {
		var customDirectives = this.$vm.constructor._cusDirectives || {};
		var customNames = Object.keys(customDirectives);
		var self = this;
		// var bindOn = /(on|bind)\:(\w*)/;
		var bindOn = /(v\-on\:|v\-bind\:|@|\:)(\w*)/;
		// short name
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
					var info = parseForExpression(attr.value);
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
	}
}