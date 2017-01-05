// import vModel from './directive/model';
// import vText from './directive/text';
// import vOn from './directive/on';
// import vBind from './directive/bind';
// import vHtml from './directive/html';
// import vFor from './directive/for';
// import vIf from './directive/if';
import parseForExpression from './parser/for';

import * as Dir from './directive/index';
import * as _ from './util';


/**
 * 编译directive
 * v-for, v-model, v-text, v-html, v-bind, v-on, v-if
 * 自定义指令
 */
export default function(Compiler) {

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function(node, attr) {
		var customDirectives = this.$vm.constructor._cusDirectives || {};
		var customNames = Object.keys(customDirectives);
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var eventReg = /on\:(\w*)/;
		var bindReg = /bind\:(\w*)/;
		var bindOn = /(on|bind)\:(\w*)/
		if (bindOn.test(property)) {
			// property = RegExp.$2;
			// console.log(self.$vm.$data);

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
					var info = parseForExpression(attr.value);
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						watchExp: info.val,
						name: property
					}, Dir['v' + _.upperFirst(property)]), node);
					break;
				default:
					console.log(property);
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