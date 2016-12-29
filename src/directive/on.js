// event hander
// 事件多次绑定
import * as _ from '../util';

// v-on:click="method(arg1, arg2, arg3)"
function vOn(node, methods, value, eventName) {
	if (typeof value !== 'string') return;
	var fnReg = /([^\(]*)(\(([^\)]*)\))/;
	// 解析
	var matches = value.match(fnReg);
	var self = this;
	if (matches) {
		var method = methods[_.trim(matches[1])] || function() {};
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

export default vOn;