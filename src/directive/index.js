import vModel from './model';
import vText from './text';
import {
    calculateExpression,
    parseForExpression,
    parseExpression
} from './expression';
import vOn from './event';
import vFor from './for';



// 设置属性值
const setScopeValue = (scope, key, value) => {
    if (~key.indexOf('.')) {
        var namespaces = key.split('.');
        var last = namespaces.pop();
        namespaces.forEach(function(name) {
            scope = scope[name] || (scope[name] = {});
        });
        scope[last] = value;
    } else {
        scope[key] = value;
    }
}


export {
    vModel,
    vText,
    setScopeValue,
    calculateExpression,
    vOn,
    vFor,
    parseForExpression,
    parseExpression
}