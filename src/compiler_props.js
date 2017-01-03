import vModel from './directive/model';
import vText from './directive/text';
import vOn from './directive/on';
import vBind from './directive/bind';
import vHtml from './directive/html';
import vFor from './directive/for';
import vIf from './directive/if';
import parseForExpression from './parser/for';


export default function(Compiler) {


	function transFlag(name, hook) {
		return '__' + name + '_' + hook + '__'
	}

	function setCalledFlag(node, flag) {
		// var flag = transFlag(name, hook);
		node[flag] = node[flag] || 0;
		node[flag]++;
	}

	// 解析自定义指令
	Compiler.prototype._parseCustomDirective = function(node, attr, name, maps) {
		var self = this;
		var flag = '';
		var binding = {
			name: name,
			expression: attr.value
		};
		if (typeof maps.bind === 'function') {
			if (!node[flag]) {
				maps.bind(node, binding);
				setCalledFlag(node, flag);
			}
		}

		if (typeof maps.update === 'function') {
			var watcher = self.bindWatch(self.$vm, attr.value, function(vm, value, oldValue) {
				maps.update(node, Object.assign({
					oldValue: oldValue,
					value: value
				}, binding));
			}, name);
		}
		// Object.keys(maps).forEach(function(hook) {
		// 	hookCallback = maps[hook];
		// 	if (hookCallback === 'function') {
		// 		flag = transFlag(name, hook);
		// 	}
		// 	var binding = {
		// 		name: name,
		// 		expression: attr.value
		// 	};

		// 	switch (hook) {
		// 		case 'bind':
		// 			// call only once
		// 			if (!node[flag]) {
		// 				hookCallback(node, binding);
		// 				setCalledFlag(node, flag);
		// 			}
		// 			break;
		// 		case 'update':
		// 			var watcher = self.bindWatch(self.$vm, attr.value, function(vm, value, oldValue) {
		// 				hookCallback(node, Object.assign({
		// 					oldValue: oldValue,
		// 					value: value
		// 				}, binding));
		// 			}, name);
		// 			break;
		// 		case 'inserted':
		// 			break;
		// 	}
		// });
	};

	// ES6 function写法会导致this解析问题
	Compiler.prototype._parseAttr = function(node, attr) {
		var customDirectives = this.$vm.constructor._directives;
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
					watcher = self.bindWatch(self.$vm, attr.value, function() {
						vModel(node, self.$vm, watcher.value);
					}, 'model');
					vModel(node, self.$vm, watcher.value);
					node.__value__ = watcher.value;
					break;
					// v-text
				case 'text':
					// filters

					watcher = self.bindWatch(self.$vm, attr.value, function() {
						vText(node, self.$vm, watcher.value);
					}, 'text');
					vText(node, this.$vm, watcher.value);
					break;
				case 'html':
					watcher = self.bindWatch(self.$vm, attr.value, function() {
						vHtml(node, self.$vm, watcher.value);
					}, 'html');
					vHtml(node, this.$vm, watcher.value);
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
				self._parseCustomDirective(node, attr, property, customDirectives[property]);
			}

		}
	}
}