'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _expression = require('../parser/expression');

var _for = require('../parser/for');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// v-on:click="method(arg1, arg2, arg3)"
// v-on:click="item.a=4"
function vOn(node, methods, value, eventName) {
	methods = methods || {};
	if (typeof value !== 'string') return;
	var self = this;
	var fnReg = /([^\(]*)(\(([^\)]*)\))?/;
	// 解析
	var matches = value.match(fnReg);
	if (!matches) return console.log('wrong format expression in v-on');
	// 函数调用或者表达式
	var methodName = _.trim(matches[1]);
	var method = methods[methodName];
	// $emit, $dispatch
	if (this[methodName] && /^\$/.test(methodName)) {
		method = this[methodName];
	}
	// for语句内部on表达式
	if (!method /* && node.__scope__*/) {
			value = (0, _for.parseItemScope)(node, value);
			method = new Function(_.addScope(value, 'this'));
		}
	var args = matches[3];
	if (args) {
		args = args.split(',');
		args.forEach(function (arg, index) {
			arg = _.trim(arg);
			// object
			if (/^\{.*\}$/.test(arg)) {
				args[index] = _.parseStr2Obj(arg, function (value) {
					return (0, _expression.calculateExpression)(self, value);
				});
			} else if (/^\'.*\'$/.test(arg)) {
				args[index] = arg.replace(/^\'|\'$/g, '');
			} else {
				args[index] = self[arg] !== undefined ? self[arg] : '';
			}
		});
	}
	// async
	(function (_args) {
		var isKeyEvent = eventName === 'keyup' || eventName === 'keydown';
		// keyup.enter
		// keyup.esc
		// avoid repeat listeners on same event.
		if (isKeyEvent) {
			var keys = node['_' + eventName];
			node._listeners = node._listeners || {};
			// 每个keyCode对应的回调
			node._listeners[keys[keys.length - 1]] = method;
		}
		if (!node._events || node._events.indexOf(eventName) === -1) {
			node.addEventListener(eventName, function (e) {
				// extend current context
				// temporary variables in v-for
				// async
				var oldVals = {};
				var iterators = _.getIterators(node);
				if (node && iterators) {
					oldVals = _.extendScope(iterators, self);
				}
				if (isKeyEvent) {
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
			node._events = node._events || [];
			node._events.push(eventName);
		}
	})(args);
}

var allowEvents = ['click', 'submit', 'touch', 'mousedown', 'keyup', 'keydown', 'dblclick', 'blur'];

// export default vOn;

exports.default = {
	bind: function bind() {
		var _this = this;

		var self = this;
		if (!this.$vm._listenedFn) {
			this.$vm._listenedFn = [];
		}
		// 原生事件
		if (allowEvents.indexOf(this.extraName) === -1) {
			// 重复方法不监听
			if (this.$vm._listenedFn.indexOf(self.expression) === -1) {
				this.$vm._listenedFn.push(self.expression);
				this.$vm.$on(this.extraName, function () {
					var method = self.$vm.methods[self.expression];
					if (!method) {
						var value = (0, _for.parseItemScope)(this.$el, self.expression);
						method = new Function(_.addScope(value, 'this'));
					}
					method.call(self.$vm);
					// self.$vm.methods[self.expression].call(self.$vm.$data);
				});
			}
		} else {
			(function () {
				// 自定义事件
				var _extend = function _extend(name) {
					self.$vm.$data[name] = function () {
						self.$vm[name].apply(self.$vm, arguments);
					};
				};
				// extend function in this.


				['$emit', '$broadcast', '$dispatch'].forEach(function (name) {
					_extend(name);
				});
				vOn.call(_this.$vm, _this.$el, _this.$vm.methods, _this.expression, _this.extraName);
			})();
		}
	}
};