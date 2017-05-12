import * as _ from '../util';
import {
	calculateExpression
} from '../parser/expression';
import {
	parseItemScope
} from '../parser/for';



// v-on:click="method(arg1, arg2, arg3)"
// v-on:click="item.a=4"
function vOn(node, methods, value, eventName) {
	var self = this;
	if (typeof value !== 'string') return;
	var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
	// 解析
	var matches = value.match(fnReg);
	if (!matches) return console.log('');
	// 函数调用或者表达式
	var method = methods[_.trim(matches[1])];
	// for语句内部on表达式
	if (!method /* && node.__scope__*/ ) {
		value = parseItemScope(node, value);
		method = new Function(_.addScope(value, 'this'));
	}
	var args = matches[3];
	if (args) {
		args = args.split(',');
		args.forEach(function(arg, index) {
			arg = _.trim(arg);
			// object
			if (/^\{.*\}$/.test(arg)) {
				args[index] = _.parseStr2Obj(arg, function(value) {
					return calculateExpression(self, value);
				});
			} else {
				args[index] = self[arg] !== undefined ? self[arg] : '';
			}
		});
	}
	// async
	(function(_args) {
		// keyup.enter
		// keyup.esc
		// avoid repeat listeners on same event.
		if (eventName === 'keyup' || eventName === 'keydown') {
			var keys = node['_' + eventName];
			node._listeners = node._listeners || {};
			// 每个keyCode对应的回调
			node._listeners[keys[keys.length - 1]] = method;
		}
		if (!node._events || node._events.indexOf(eventName) === -1) {
			node.addEventListener(eventName, function(e) {
				// extend current context
				// temporary variables in v-for
				// async
				var oldVals = {};
				var iterators = _.getIterators(node);
				if (node && iterators) {
					oldVals = _.extendScope(iterators, self);
				}
				if (eventName === 'keyup' || eventName === 'keydown') {
					var code = e.keyCode || e.charCode;
					var key = _.getKey(code);
					var codes = _.getKeyCodes(keys);
					if (~codes.indexOf(code) && key) {
						node._listeners[key].apply(self, [e]);
					}
				} else {
					method.apply(self, (_args || []).concat([e]));
				}
				_.resetObject(oldVals, self);
			}, false);
			// all event listeners
			node._events = node._events || []
			node._events.push(eventName);
		}
	})(args);
}


var allowEvents = ['click', 'submit', 'touch', 'mousedown', 'keyup', 'keydown', 'dblclick', 'blur'];


// export default vOn;

export default {
	bind: function() {
		var self = this;
		if (!this.$vm._listenedFn) {
			this.$vm._listenedFn = [];
		}
		// 原生事件
		if (allowEvents.indexOf(this.extraName) === -1) {
			// 重复方法不监听
			if (this.$vm._listenedFn.indexOf(self.expression) === -1) {
				this.$vm._listenedFn.push(self.expression);
				this.$vm.$on(this.extraName, function() {
					self.$vm.methods[self.expression].call(self.$vm.$data);
				});
			}
		} else {
			// 自定义事件
			function _extend(name) {
				self.$vm.$data[name] = function() {
					self.$vm[name].apply(self.$vm, arguments);
				};
			}
			// extend function in this.
			['$emit', '$broadcast', '$dispatch'].forEach(function(name) {
				_extend(name);
			});
			vOn.call(this.$vm, this.$el, this.$vm.methods, this.expression, this.extraName);
		}
	}
}