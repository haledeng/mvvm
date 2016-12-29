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
		var self = this;
		var attrReg = /^v\-([\w\:\']*)/;
		var matches = attr.name.match(attrReg);
		var property = matches[1];
		var eventReg = /on\:(\w*)/;
		var bindReg = /bind\:(\w*)/;
		if (eventReg.test(property)) {
			var eventName = RegExp.$1;
			vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value, eventName);
			// event handler
		} else if (bindReg.test(property)) {
			var bindProperty = RegExp.$1;
			self.bindWatch(self.$vm, attr.value, function() {
				vBind.call(self.$vm.$data, node, self.$vm, attr.value, bindProperty);
			}, 'bind');
			// TODO: watcher
			vBind.call(this.$vm.$data, node, this.$vm, attr.value, bindProperty);
		} else {
			switch (property) {
				// v-model
				case 'model':
					self.bindWatch(self.$vm, attr.value, function() {
						vModel(node, self.$vm, attr.value);
					}, 'model');
					vModel(node, self.$vm, attr.value);
					break;
					// v-text
				case 'text':
					// filters
					self.bindWatch(self.$vm, attr.value, function() {
						vText(node, self.$vm, attr.value);
					}, 'text');
					vText(node, this.$vm, attr.value);
					break;
				case 'html':
					self.bindWatch(self.$vm, attr.value, function() {
						vHtml(node, self.$vm, attr.value);
					}, 'html');
					vHtml(node, this.$vm, attr.value);
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
					self.bindWatch(self.$vm, attr.value, function() {
						vIf(node, self.$vm, attr.value);
					}, 'if');
					vIf(node, this.$vm, attr.value);
					break;
				default:
					break;
			}
		}
	}
}