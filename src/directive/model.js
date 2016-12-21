import calculateExpression from './expression';

const vModel = (node, scope, key) => {
    var tagName = node.tagName.toLowerCase();
    var value = calculateExpression(scope, key);
    if (tagName === 'input') {
        node.value = value;
    } else if (tagName === 'textarea') {
        node.innerHTML = value;
    }
    // node.removeAttribute('v-model');
}

export default vModel;