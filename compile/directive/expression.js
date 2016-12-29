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

var _for2 = _interopRequireDefault(_for);

var _filter2 = require('../parser/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _expression = require('../parser/expression');

var _expression2 = _interopRequireDefault(_expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// +,-,m.n,*,/,>,<,>=,<=,==,===
// 添加上下文
// AST?
// const addScope = (exp, prefix = 'scope') => {
//     exp = _.trim(exp);
//     // x.y
//     // Math.random()  全局函数调用
//     var globalObject = ['Math'];
//     exp = exp.replace(/\w+(?=\.)/g, function(match, index, all) {
//         if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
//         return [prefix, match].join('.');
//     });
//     exp = ' ' + exp + ' ';
//     // x
//     exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function(match, index, all) {
//         match = _.trim(match);
//         if (/^[0-9]*$/.test(match)) {
//             return match;
//         }
//         return [prefix, match].join('.');
//     });
//     return _.trim(exp);
// }

// // 计算表达式
// // strict mode can not use with
// // new Function
// const calculateExpression = (scope, exp) => {
//     // Plan A
//     var prefix = 'scope';
//     exp = addScope(exp);
//     var fn = new Function(prefix, 'return ' + exp);
//     return fn(scope);
//     // Plan B
//     // with(scope) {
//     //  return eval(exp);
//     // }
// }

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
                value = _filter.filter.apply(null, [vm, filterInfo.method, (0, _expression2.default)(data, filterInfo.param)].concat(filterInfo.args));
            } else {
                value = (0, _expression2.default)(data, exp);
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
exports.calculateExpression = _expression2.default;
exports.parseForExpression = _for2.default;
exports.parseFilterExpression = _filter3.default;
exports.parseExpression = parseExpression;