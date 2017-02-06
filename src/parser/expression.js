import * as _ from '../util';


// 计算表达式
// strict mode can not use with
// new Function
const calculateExpression = (scope, exp) => {
	// Plan A
	var prefix = 'scope';
	exp = _.addScope(exp);
	var fn = new Function(prefix, 'return ' + exp);
	return fn(scope);
	// Plan B, can not be parsed.
	// with(scope) {
	//  return eval(exp);
	// }
}

export default calculateExpression;