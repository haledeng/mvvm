import calculateExpression from './expression';
// v-text
const vText = (node, scope, key) => {
    node.innerHTML = calculateExpression(scope, key);
    // 影响后面attribute遍历
    // node.removeAttribute('v-text');
};

export default vText;