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
        return [prefix, _.trim(match)].join('.');
    });
    return _.trim(exp);

    // return exp.replace(/^([\'\w]*)\s*?([\+\-\*\/\.])?\s*?([\'\w]*)?$/, function(total, all, left, operater, right) {
    //  if (left.indexOf('\'') === -1) {
    //      left = [prefix, left].join('.');
    //  }
    //  if (right && right.indexOf('\'') === -1) {
    //      if (operater !== '.') {
    //          right = [prefix, right].join('.');
    //      }
    //      return left + operater + right;
    //  }
    //  return left;
    // });
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

export default calculateExpression;