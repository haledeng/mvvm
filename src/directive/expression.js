import * as _ from '../util';
import {
    filter
} from '../filter';

import parseBind from '../parser/bind';
import parseForExpression from '../parser/for';
import parseFilterExpression from '../parser/filter';
import calculateExpression from '../parser/expression';

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
            value = parseBind(vm, exp);
            break;
        default:
            if (hasFilter(exp)) {
                var filterInfo = parseFilterExpression(exp);
                value = filter.apply(null, [vm, filterInfo.method, calculateExpression(data, filterInfo.param)].concat(filterInfo.args));
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
export {
    calculateExpression,
    parseForExpression,
    parseFilterExpression,
    parseExpression
};