'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _for = require('../parser/for');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// v-on:click="method(arg1, arg2, arg3)"
// v-on:click="item.a=4"
// event hander
// 事件多次绑定
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
		if (!method /* && node.__scope__*/) {
				// var scope = node.__scope__;
				// TODO: RegExp 
				// value = value.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
				value = (0, _for.parseItemScope)(node, value);
				method = new Function(_.addScope(value, 'this'));
			}
		var args = matches[3];
		if (args) {
			args = args.split(',');
			args.forEach(function (arg, index) {
				arg = _.trim(arg);
				args[index] = self[arg] !== undefined ? self[arg] : '';
			});
		}
		node.addEventListener(eventName, function () {
			method.apply(self, args);
			// watcher表达式计算有问题
		}, false);
	}
}

var allowEvents = ['click', 'submit', 'touch', 'mousedown'];

// export default vOn;

exports.default = {
	bind: function bind() {
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
				this.$vm.$on(this.extraName, function () {
					self.$vm.methods[self.expression].call(self.$vm.$data);
				});
			}
		} else {
			// 向父节点dispatch事件
			var parent = self.$vm.$parent;
			this.$vm.$data.$emit = function (name) {
				parent.$emit.call(parent, name);
			};
			vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
		}
	}
};