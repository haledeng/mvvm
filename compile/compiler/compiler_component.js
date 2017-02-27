'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {
	Compiler.prototype._parseComponent = function (node) {
		var self = this;
		var allCom = this.$vm.constructor._globalCom;
		var descriptor = allCom[node.tagName.toLowerCase()];
		var props = descriptor.props || [];
		// props获取的数据
		descriptor._data = parseProps(props, self.$vm, node);
		// component是全局VM的一个child
		var instance = new _component2.default(descriptor.name, descriptor);
		var vm = this.$vm;

		var comVm = Object.create(vm.__proto__);
		comVm.methods = instance.methods;
		comVm.$data = instance.data;
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		(vm.$children || (vm.$children = [])).push(comVm);

		//  每个Componet的instance是沙箱模式
		new Compiler({
			el: instance.frag,
			vm: comVm
		});
		var commentNode = document.createComment(node.outerHTML);
		node.parentNode.insertBefore(commentNode, node);
		node.parentNode.insertBefore(instance.frag, node);
		node.parentNode.removeChild(node);
		// node.parentNode.replaceChild(instance.frag, node);

		// listener
		props.forEach(function (prop) {
			// new Watcher({
			// 	vm: vm,
			// 	$el: node,
			// 	exp: prop,
			// 	callback: function(vm, value, oldValue) {
			// 		// TODO: component的props的监听回调
			// 		// 重复监听data
			// 		console.log(value);
			// 	}
			// });
		});
	};
};

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _watcher = require('../observer/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _expression = require('../directive/expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 解析自定义component
// import Observer from '../observer';

function parseProps(props, vm, node) {
	var ret = {};
	props.forEach(function (prop) {
		ret[prop] = (0, _expression.parseExpression)(vm, node.getAttribute(_.kebabCase(prop)));
		// new Watcher({
		// 	vm: vm,
		// 	$el: node,
		// 	exp: prop,
		// 	callback: function(vm, value, oldValue) {
		// 		// TODO: component的props的监听回调
		// 		console.log(value);
		// 	}
		// });
	});
	return ret;
}