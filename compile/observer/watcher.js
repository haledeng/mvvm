'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _depender = require('./depender');

var _depender2 = _interopRequireDefault(_depender);

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _expression = require('../directive/expression');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

var Watcher = function () {
	function Watcher(opts) {
		_classCallCheck(this, Watcher);

		this.id = ++uid;
		this.vm = opts.vm;
		this.$el = opts.$el;
		this.exp = opts.exp;
		this.directive = opts.directive || '';
		this.callback = opts.callback;
		this.value = this.init();
	}

	_createClass(Watcher, [{
		key: 'update',
		value: function update() {
			var hasToUpdate = true;

			var newVal = this.get();
			var oldVal = this.value;
			this.value = newVal;
			var valType = _.getType(newVal);
			// 是否需要触发更新回调
			if (valType === 'object') {
				if (_.isObjectEqual(newVal, oldVal)) {
					hasToUpdate = false;
				}
			} else if (valType === 'array') {
				if (_.isArrayEqual(newVal, oldVal)) {
					hasToUpdate = false;
				}
			} else {
				hasToUpdate = oldVal != newVal;
			}
			hasToUpdate && this.callback(this.vm, newVal, oldVal);
		}
	}, {
		key: 'beforeGet',
		value: function beforeGet() {
			_depender2.default.target = this;
		}
	}, {
		key: 'afterGet',
		value: function afterGet() {
			_depender2.default.target = null;
		}
	}, {
		key: 'init',
		value: function init() {
			this.beforeGet();
			var value = this.get();
			this.afterGet();
			return value;
		}
	}, {
		key: 'get',
		value: function get() {
			return (0, _expression.parseExpression)(this.vm, this.exp, this.directive, this.$el);
		}
	}]);

	return Watcher;
}();

exports.default = Watcher;