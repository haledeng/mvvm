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
import calculateExpression from '../parser/expression';


// whether expression has filter
function hasFilter(exp) {
    // if (!exp || exp.indexOf('|') === -1) return false;
    return exp && /\s\|\s/.test(exp);
    // return true;
}



function parseExpression(vm, exp, directive, node) {
    var data = vm.$data;
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
                value = filter.apply(null, [vm, filterInfo.method, calculateExpression(data, filterInfo.param)].concat(filterInfo.args));
            } else {
                // computed property.
                // if (value === null && vmComputed[exp]) {
                //     // value = vmComputed[exp].call(vm.$data);
                //     value = vmComputed[exp].call(vm);
                // } else {
                value = calculateExpression(data, exp);
                // 向上查找
                if (vm.props && vm.props[exp]) {
                    value = value || calculateExpression(vm.$parent.$data, vm.props[exp]);
                }
                // }
            }
            break;

    }
    return value;
}

export {
    calculateExpression,
    parseForExpression,
    parseFilterExpression,
    parseExpression
};