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
    if (!exp || exp.indexOf('|') === -1) return false;
    return true;
}



function parseExpression(vm, exp, directive, node) {
    var data = vm.$data;
    var value = null;
    var vmComputed = vm.computed || {};
    // in v-for
    // if (node && node.__scope__) {
    //     var scope = node.__scope__;
    //     exp = exp.replace(new RegExp(scope.$item, 'g'), scope.val + '[' + scope.index + ']');
    // }
    exp = parseItemScope(node, exp);
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
                if (vmComputed[exp]) {
                    value = vmComputed[exp].call(vm.$data);
                } else {
                    value = calculateExpression(data, exp);
                }
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