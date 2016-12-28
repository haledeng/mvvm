'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseExpression = exports.parseFilter = exports.parseForExpression = exports.addScope = exports.calculateExpression = undefined;

var _util = require('../util');

var _ = _interopRequireWildcard(_util);

var _filter = require('../filter');

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

function parseExpression(vm, exp) {
    var data = vm.$data;
    // debugger;
    if (hasFilter(exp)) {
        var filterInfo = parseFilter(exp);
        var value = calculateExpression(data, filterInfo.param);
        return _filter.filter.apply(null, [vm, filterInfo.method, value].concat(filterInfo.args));
        // return filter.apply(vm, filterInfo.method, [filterInfo.param].concat(filterInfo.args));
    } else {
        return calculateExpression(data, exp);
    }
}

// v-for expression
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

// 解析filter表达式
// paramName | filterName arg1 arg2
function parseFilter(str) {
    if (!str || str.indexOf('|') === -1) return null;
    var splits = str.split('|');
    var paramName = _.trim(splits[0]);
    var args = _.trim(splits[1]).split(' ');
    var methodName = args.shift();
    return {
        param: paramName,
        args: typeCheck(args),
        method: methodName
    };
}

// whether expression has filter
function hasFilter(exp) {
    if (!exp || exp.indexOf('|') === -1) return false;
    return true;
}

// 类型转化
function typeCheck(args) {
    var rets = [];
    args.forEach(function (arg, index) {
        arg = _.trim(arg);
        // number
        if (/^[0-9]$/.test(arg)) {
            rets[index] = Number(arg);
        } else {
            // "'string'" => string
            rets[index] = arg.replace(/^\'|\'$/g, '');
        }
    });
    return rets;
}

exports.calculateExpression = calculateExpression;
exports.addScope = addScope;
exports.parseForExpression = parseForExpression;
exports.parseFilter = parseFilter;
exports.parseExpression = parseExpression;