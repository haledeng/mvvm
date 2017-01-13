import parse from './attr2prop';

function parseStyle(one, two, key) {
	if (key === 'style') {
		var oneStyles = parse(one[key]);
		var twoStyles = parse(two[key]);
		return diffProps(oneStyles, twoStyles);
	} else {
		return two[key];
	}
}

function diffProps(one, two) {
	var diff;
	for (var k in one) {
		if (!(k in two)) {
			diff = diff || {};
			diff[k] = undefined;
		}

		if (one[k] !== two[k]) {
			diff = diff || {};
			// style增量更新
			diff[k] = parseStyle(one, two, k);
		}
	}

	for (var key in two) {
		if (!(key in one)) {
			diff = diff || {};
			diff[key] = parseStyle(one, two, key);
		}
	}

	return diff;
};


export default diffProps;