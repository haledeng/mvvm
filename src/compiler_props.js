import vModel from './directive/model';
import vText from './directive/text';
import vOn from './directive/on';
import vBind from './directive/bind';
import vHtml from './directive/html';
import vFor from './directive/for';
import vIf from './directive/if';
import parseForExpression from './parser/for';



export default function(Compiler) {

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function(node, attr) {
		var customDirectives = this.$vm.constructor._cusDirectives;
		var customNames = Object.keys(customDirectives);
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var eventReg = /on\:(\w*)/;
		var bindReg = /bind\:(\w*)/;
		var watcher;
		if (eventReg.test(property)) {
			var eventName = RegExp.$1;
			vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
			// event handler
		} else if (bindReg.test(property)) {
			var bindProperty = RegExp.$1;
			watcher = self.bindWatch(self.$vm, attr.value, function() {
				vBind.call(self.$vm.$data, node, self.$vm, watcher.value, bindProperty);
			}, 'bind');
			vBind.call(this.$vm.$data, node, this.$vm, watcher.value, bindProperty);
		} else {
			switch (property) {
				// v-model
				case 'model':
					// listening input
					// watcher = self.bindWatch(self.$vm, attr.value, function() {
					// 	vModel(node, self.$vm, watcher.value);
					// }, 'model');
					// vModel(node, self.$vm, watcher.value);
					// node.__value__ = watcher.value;
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						name: property
					}, vModel), node);
					break;
					// v-text
				case 'text':
					// filters

					// watcher = self.bindWatch(self.$vm, attr.value, function() {
					// 	vText(node, self.$vm, watcher.value);
					// }, 'text');
					// vText(node, this.$vm, watcher.value);
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						name: property
					}, vText), node);
					break;
				case 'html':
					self.$vm.bindDir(Object.assign({
						expression: attr.value,
						name: property
					}, vHtml), node);
					// watcher = self.bindWatch(self.$vm, attr.value, function() {
					// 	vHtml(node, self.$vm, watcher.value);
					// }, 'html');
					// vHtml(node, this.$vm, watcher.value);
					break;
				case 'for':
					var info = parseForExpression(attr.value);
					self.bindWatch(self.$vm, info.val, function() {
						vFor(node, self.$vm, attr.value);
					}, 'for');
					vFor(node, this.$vm, attr.value);
					break;
				case 'if':
					// parse expression

					watcher = self.bindWatch(self.$vm, attr.value, function() {
						// debugger;
						vIf(node, self.$vm, watcher.value);
					}, 'if');
					vIf(node, this.$vm, watcher.value);
					break;
				default:
					break;
			}

			if (~customNames.indexOf(property)) {
				self.$vm.bindDir(Object.assign({
					expression: attr.value,
					name: property
				}, customDirectives[property]), node);
				// 	self._parseCustomDirective(node, attr, property, customDirectives[property]);
			}

		}
	}
}