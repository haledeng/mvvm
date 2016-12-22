'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseForExpression = exports.addScope = exports.calculateExpression = undefined;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// +,-,m.n,*,/
// 添加上下文
// AST?
var addScope = function addScope(exp) {
    var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'scope' : arguments[1];

    exp = _.trim(exp);
    // x.y
    exp = exp.replace(/\w+(?=\.)/g, function (match, index, all) {
        return [prefix, match].join('.');
    });
    exp = ' ' + exp + ' ';
    // x
    exp = exp.replace(/[\+\-\*\/\s]\w+(?![\'\.])[\+\-\*\/\s]/g, function (match, index, all) {
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
};

// 计算表达式
// strict mode can not use with
// new Function
var calculateExpression = function calculateExpression(scope, exp) {
    var prefix = 'scope';
    exp = addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    return fn(scope);
    // with(scope) {
    //  return eval(exp);
    // }
};

function parseForExpression(expression) {
    // variable name
    var valReg = /([^\s]*)\s*?$/;
    var ret = {};
    if (valReg.test(expression)) {
        ret.val = RegExp.$1;
    }
    // template variable name
    // like: xxx in obj
    var tempReg = /^\s?([^\s]*)/;
    if (tempReg.test(expression)) {
        ret.scope = RegExp.$1;
    }
    return ret;
}

exports.calculateExpression = calculateExpression;
exports.addScope = addScope;
exports.parseForExpression = parseForExpression;