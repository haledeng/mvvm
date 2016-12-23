import * as _ from '../util';
// +,-,m.n,*,/
// 添加上下文
// AST?
const addScope = (exp, prefix = 'scope') => {
    exp = _.trim(exp);
    // x.y
    exp = exp.replace(/\w+(?=\.)/g, function(match, index, all) {
        return [prefix, match].join('.');
    });
    exp = ' ' + exp + ' ';
    // x
    exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function(match, index, all) {
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
    
    var prefix = 'scope';
    exp = addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    return fn(scope);
    // with(scope) {
    //  return eval(exp);
    // }
}


function parseForExpression(expression) {
    // variable name
    var valReg = /in\s*([^\s]*)\s*?$/;
    var ret = {};
    if (valReg.test(expression)) {
        ret.val = RegExp.$1;
    }
    // template variable name
    // like: xxx in obj
    // like: (item, index) in arr
    // like: (item, value, index) in arr
    var tempReg = /^\s?(.*)\s*in/;
    if (tempReg.test(expression)) {
        var itemStr = _.trim(RegExp.$1);
        if (~itemStr.indexOf(',')) {
            itemStr = itemStr.replace(/\(|\)/g, '');
            itemStr = _.trim(itemStr);
            var temp = itemStr.split(',');
            ret.scope = _.trim(temp[0]);
            ret.index = _.trim(temp[1]);
        } else {
            ret.scope = itemStr;
        }
    }
    return ret;
}

export {
    calculateExpression,
    addScope,
    parseForExpression
};