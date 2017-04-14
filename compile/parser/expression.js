'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseExpression = exports.calculateExpression = undefined;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _filter = require('../filter');

var _bind = require('./bind');

var _bind2 = _interopRequireDefault(_bind);

var _for = require('./for');

var _filter2 = require('./filter');

var _filter3 = _interopRequireDefault(_filter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// whether expression has filter
function hasFilter(exp) {
    return exp && /\s\|\s/.test(exp);
}

function parseExpression(vm, exp, directive, node) {
    var value = null;
    var vmComputed = vm.computed || {};
    node && (exp = (0, _for.parseItemScope)(node, exp));
    switch (directive) {
        case 'bind':
            value = (0, _bind2.default)(vm, exp);
            break;
        default:
            if (hasFilter(exp)) {
                var filterInfo = (0, _filter3.default)(exp);
                value = _filter.filter.apply(null, [vm, filterInfo.method, calculateExpression(vm, filterInfo.param)].concat(filterInfo.args));
            } else {
                value = calculateExpression(vm, exp);
                // 向上查找
                if (vm.props && vm.props[exp]) {
                    value = calculateExpression(vm.$parent, vm.props[exp]);
                }
            }
            break;

    }
    return value;
}

var calculateExpression = function calculateExpression(scope, exp) {
    // with expression. not support in strict mode.
    var prefix = 'scope';
    exp = _.addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    return fn(scope);
};

exports.calculateExpression = calculateExpression;
exports.parseExpression = parseExpression;