import * as _ from '../util';
import {
    filter
} from '../filter';

import parseBind from './bind';
import {
    parseForExpression,
    parseItemScope
} from './for';

import parseFilterExpression from './filter';


// whether expression has filter
function hasFilter(exp) {
    return exp && /\s\|\s/.test(exp);
}


function parseExpression(vm, exp, directive, node) {
    var value = null;
    var vmComputed = vm.computed || {};
    node && (exp = parseItemScope(node, exp));
    // extend context 统一放到compiler中
    // 放到compiler中，由于异步的问题，这里计算有bug
    var oldVals = {};
    var iterators = _.getIterators(node);
    // extend vm scope, v-for temp variable
    if (node && iterators) {
        oldVals = _.extendScope(iterators, vm);
    }
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
                    value = calculateExpression(vm.$parent, vm.props[exp]);
                }
            }
            break;

    }
    _.resetObject(oldVals, vm);
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
    parseExpression
};