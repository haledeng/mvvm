'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseExpression = exports.parseFilterExpression = exports.parseForExpression = exports.calculateExpression = undefined;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _filter = require('../filter');

var _bind = require('../parser/bind');

var _bind2 = _interopRequireDefault(_bind);

var _for = require('../parser/for');

var _filter2 = require('../parser/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _expression = require('../parser/expression');

var _expression2 = _interopRequireDefault(_expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// whether expression has filter
function hasFilter(exp) {
    if (!exp || exp.indexOf('|') === -1) return false;
    return true;
}

function parseExpression(vm, exp, directive, node) {
    var data = vm.$data;
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
                value = _filter.filter.apply(null, [vm, filterInfo.method, (0, _expression2.default)(data, filterInfo.param)].concat(filterInfo.args));
            } else {
                // computed property.
                if (vmComputed[exp]) {
                    value = vmComputed[exp].call(vm.$data);
                } else {
                    value = (0, _expression2.default)(data, exp);
                }
            }
            break;

    }
    return value;
}

exports.calculateExpression = _expression2.default;
exports.parseForExpression = _for.parseForExpression;
exports.parseFilterExpression = _filter3.default;
exports.parseExpression = parseExpression;