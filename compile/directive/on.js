'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// v-on:click="method(arg1, arg2, arg3)"
// v-on:click="item.a=4"
function vOn(node, methods, value, eventName) {
	if (typeof value !== 'string') return;
	var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
	// 解析
	var matches = value.match(fnReg);
	var self = this;
	if (matches) {
		// 函数调用或者表达式
		var method = methods[_.trim(matches[1])] || new Function(_.addScope(value, 'this'));
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
		}, false);
	}
}

// export default vOn;

// event hander
// 事件多次绑定
exports.default = {
	bind: function bind() {
		// TODO：vOn里面的scope不一定是data，特别是在v-for中
		vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
	}
};