// event hander
// 事件多次绑定
import * as _ from '../util';

const addScope = (exp, prefix = 'scope') => {
	exp = _.trim(exp);
	// x.y
	// Math.random()  全局函数调用
	var globalObject = ['Math'];
	exp = exp.replace(/\w+(?=\.)/g, function(match, index, all) {
		if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
		return [prefix, match].join('.');
	});
	exp = ' ' + exp + ' ';
	// x
	exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function(match, index, all) {
		match = _.trim(match);
		if (/^[0-9]*$/.test(match)) {
			return match;
		}
		return [prefix, match].join('.');
	});
	return _.trim(exp);
}

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
		var method = methods[_.trim(matches[1])] || new Function(addScope(value, 'this'));
		var args = matches[3];
		if (args) {
			args = args.split(',');
			args.forEach(function(arg, index) {
				arg = _.trim(arg);
				args[index] = self[arg] !== undefined ? self[arg] : '';
			});
		}
		node.addEventListener(eventName, function() {
			method.apply(self, args);
		}, false);
	}

}



// export default vOn;

export default {
	bind: function() {
		// TODO：vOn里面的scope不一定是data，特别是在v-for中
		vOn.call(this.$vm.$data, this.$el, this.$vm.methods, this.expression, this.extraName);
	}
}