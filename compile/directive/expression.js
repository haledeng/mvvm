'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseExpression = exports.parseFilterExpression = exports.parseForExpression = exports.addScope = exports.calculateExpression = undefined;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _filter = require('../filter');

var _bind = require('../parser/bind');

var _bind2 = _interopRequireDefault(_bind);

var _for = require('../parser/for');

var _for2 = _interopRequireDefault(_for);

var _filter2 = require('../parser/filter');

var _filter3 = _interopRequireDefault(_filter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// +,-,m.n,*,/,>,<,>=,<=,==,===
// 添加上下文
// AST?
var addScope = function addScope(exp) {
    var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

    exp = _.trim(exp);
    // x.y
    // Math.random()  全局函数调用
    var globalObject = ['Math'];
    exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
        if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
        return [prefix, match].join('.');
    });
    exp = ' ' + exp + ' ';
    // x
    exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function (match, index, all) {
        match = _.trim(match);
        if (/^[0-9]*$/.test(match)) {
            return match;
        }
        return [prefix, match].join('.');
    });
    return _.trim(exp);
};

// 计算表达式
// strict mode can not use with
// new Function
var calculateExpression = function calculateExpression(scope, exp) {
    // Plan A
    var prefix = 'scope';
    exp = addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    return fn(scope);
    // Plan B
    // with(scope) {
    //  return eval(exp);
    // }
};

// v-bind: expression
function parseExpression(vm, exp, directive) {
    var data = vm.$data;
    var value = null;
    switch (directive) {
        case 'bind':
            value = (0, _bind2.default)(vm, exp);
            break;
        default:
            if (hasFilter(exp)) {
                var filterInfo = (0, _filter3.default)(exp);
                value = _filter.filter.apply(null, [vm, filterInfo.method, calculateExpression(data, filterInfo.param)].concat(filterInfo.args));
            } else {
                value = calculateExpression(data, exp);
            }
            break;

    }
    return value;
}

// whether expression has filter
function hasFilter(exp) {
    if (!exp || exp.indexOf('|') === -1) return false;
    return true;
}
exports.calculateExpression = calculateExpression;
exports.addScope = addScope;
exports.parseForExpression = _for2.default;
exports.parseFilterExpression = _filter3.default;
exports.parseExpression = parseExpression;