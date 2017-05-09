// event hander
// 事件多次绑定
import * as _ from '../util';
import {
	calculateExpression
} from '../parser/expression';
import {
	parseItemScope
} from '../parser/for';


var keyCodeConf = {
	'enter': 13
}

// v-on:click="method(arg1, arg2, arg3)"
// v-on:click="item.a=4"
function vOn(node, methods, value, eventName) {
	// console.log(node.__scope__);
	if (typeof value !== 'string') return;
	var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
	// 解析
	var matches = value.match(fnReg);
	var self = this;
	if (matches) {
		// 函数调用或者表达式
		var method = methods[_.trim(matches[1])];
		// for语句内部on表达式
		if (!method /* && node.__scope__*/ ) {
			// var scope = node.__scope__;
			// TODO: RegExp 
			// value = value.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
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
			node.addEventListener(eventName, function(e) {
				if (eventName === 'keyup') {
					var code = e.keyCode || e.charCode;
					if (code == keyCodeConf[node['_' + eventName]]) {
						method.apply(self, [e]);
					}
				} else {
					method.apply(self, (_args || []).concat([e]));
				}
			}, false);
		})(args);
	}

}


var allowEvents = ['click', 'submit', 'touch', 'mousedown', 'keyup'];


// export default vOn;

export default {
	bind: function() {
		var self = this;
		if (!this.$vm._listenedFn) {
			this.$vm._listenedFn = [];
		}
		// TODO：vOn里面的scope不一定是data，特别是在v-for中
		if (allowEvents.indexOf(this.extraName) === -1) {
			// 重复方法不监听
			if (this.$vm._listenedFn.indexOf(self.expression) === -1) {
				this.$vm._listenedFn.push(self.expression);
				// custom event;
				this.$vm.$on(this.extraName, function() {
					self.$vm.methods[self.expression].call(self.$vm.$data);
					// self.$vm.methods[self.expression].call(self);
				});
			}
		} else {

			function _extend(name) {
				self.$vm.$data[name] = function() {
					self.$vm[name].apply(self.$vm, arguments);
				};
			}

			// extend function in this.
			['$emit', '$broadcast', '$dispatch'].forEach(function(name) {
				_extend(name);
			});

			// vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
			vOn.call(this.$vm, this.$el, this.$vm.methods, this.expression, this.extraName);
		}
	}
}