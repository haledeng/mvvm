// event hander
// 事件多次绑定
import * as _ from '../util';
import parseItemScope from '../parser/for';

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
				args[index] = self[arg] !== undefined ? self[arg] : '';
			});
		}
		node.addEventListener(eventName, function() {
			method.apply(self, args);
			// watcher表达式计算有问题
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