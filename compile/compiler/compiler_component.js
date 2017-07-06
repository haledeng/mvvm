'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (Compiler) {
	Compiler.prototype._parseComponent = function (node) {
		var self = this;
		var allCom = this.$vm.constructor._globalCom;
		var vm = this.$vm;
		var descriptor = allCom[node.tagName.toLowerCase()];
		descriptor.parent = vm;
		// props获取的数据
		// props中的数据会被重复监听（component一次，MVVM初始化一次）
		// component是全局VM的一个child
		var comVm = Object.create(vm.__proto__);
		var instance = new _component2.default(node, descriptor.name, descriptor, comVm);

		comVm.methods = instance.methods;
		// parse表达式时，向上查找
		// comVm.$data = instance.data || {};


		comVm.props = _.parseNodeAttr2Obj(node);
		// 记录全局VM
		comVm.$parent = vm;
		comVm._events = instance.events;
		// TODO: directives
		(vm.$children || (vm.$children = [])).push(comVm);
		//  每个Componet的instance是沙箱模式
		if (instance.frag) {
			new Compiler({
				el: instance.frag,
				vm: comVm
			});
		}
		// _.resetObject(oldVals, comVm.$data);
		node._component = instance;
		node.parentNode && node.parentNode.replaceChild(instance.frag, node);
	};
};

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _expression = require('../parser/expression');

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }