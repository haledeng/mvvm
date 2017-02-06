import * as _ from '../util';
export default {
	capitalize: function(val) {
		if (!val && val !== 0) return '';
		val = val.toString();
		return val.charAt(0).toUpperCase() + val.substr(1);
	},
	getType: _.getType,
	trim: _.trim
}