import * as _ from '../util';
import {
    filter
} from '../filter';

import parseBind from '../parser/bind';
import {
    parseForExpression,
    parseItemScope
} from '../parser/for';
import parseFilterExpression from '../parser/filter';


// whether expression has filter
function hasFilter(exp) {
    return exp && /\s\|\s/.test(exp);
}

function parseExpression(vm, exp, directive, node) {
    var value = null;
    var vmComputed = vm.computed || {};
    node && (exp = parseItemScope(node, exp));
    switch (directive) {
        case 'bind':
            value = parseBind(vm, exp);
            break;
        default:
            if (hasFilter(exp)) {
                var filterInfo = parseFilterExpression(exp);
                value = filter.apply(null, [vm, filterInfo.method, calculateExpression(vm, filterInfo.param)].concat(filterInfo.args));
            } else {
                value = calculateExpression(vm, exp);
                // 向上查找
                if (vm.props && vm.props[exp]) {
                    value = value || calculateExpression(vm.$parent, vm.props[exp]);
                }
            }
            break;

    }
    return value;
}

const calculateExpression = (scope, exp) => {
    // with expression. not support in strict mode.
    var prefix = 'scope';
    exp = _.addScope(exp);
    var fn = new Function(prefix, 'return ' + exp);
    return fn(scope);
}

export {
    calculateExpression,
    parseForExpression,
    parseExpression
};