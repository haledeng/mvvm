import * as _ from '../util';
const addScope = (exp, prefix = 'scope') => {
    exp = _.trim(exp);
    // x.y
    // Math.random()  全局函数调用
    var globalObject = ['Math'];
    exp = exp.replace(/\w+(?=\.)/g, function(match, index, all) {
        if (~globalObject.indexOf(match) || /^\d$/.test(match)) return match;
        return [prefix, match].join('.');
    });
    exp = ' ' + exp + ' ';
    // x
    exp = exp.replace(/[\+\-\*\/\s\>\<\=]\w+(?![\'\.])[\+\-\*\/\s\>\<\=]/g, function(match, index, all) {
        match = _.trim(match);
        if (/^[0-9]*$/.test(match)) {
            return match;
        }
        return [prefix, match].join('.');
    });
    return _.trim(exp);
}

// 计算表达式
// strict mode can not use with
// new Function
const calculateExpression = (scope, exp) => {
    // Plan A
    var prefix = 'scope';
    exp = addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    // console.log(exp, scope);
    return fn(scope);
    // Plan B
    // with(scope) {
    //  return eval(exp);
    // }
}

export default calculateExpression;