import * as _ from '../util';


// 计算表达式
// new Function
const calculateExpression = (scope, exp) => {
	var prefix = 'scope';
	exp = _.addScope(exp);
	var fn = new Function(prefix, 'return ' + exp);
	return fn(scope);
	// with. //strict mode.
}

export default calculateExpression;