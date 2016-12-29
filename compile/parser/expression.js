'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

exports.default = calculateExpression;