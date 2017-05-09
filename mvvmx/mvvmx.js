var applyMixin = function() {
	var _init = MVVM.prototype.init;
	MVVM.prototype.init = function(options) {
		options.init = options.init ? options.init.push(mvvmxInit) : [mvvmxInit];
		_init.call(this, options);
	}
};

function mvvmxInit() {
	var options = this.$options;
	if (options.store) {
		this.$store = options.store;
	}
}

var devPlugins = [];

function Store(options) {
	var self = this;
	this.state = options.state;
	var plugins = options.plugins || [];
	this._subscribers = [];
	this._mutations = options.mutations || Object.create(null);

	plugins.concat(devPlugins).forEach(function(plugin) {
		return plugin(self);
	});

	// add observer.
	this._vm = new MVVM({
		data: {
			$$state: options.state
		}
	});
}

var _proto_ = Store.prototype;

_proto_.subscribe = function(fn) {
	var subs = this._subscribers;
	if (subs.indexOf(fn) === -1) {
		subs.push(fn);
	}
	return (function(i) {
		return function() {
			if (i > -1) {
				subs.splice(i, 1);
			}
		}
	})(subs.length - 1);
};

_proto_.commit = function(action, data) {
	if (!action) return;
	var self = this;
	var mutations = this._mutations,
		mutation = mutations[action];
	if (typeof mutation === 'function') {
		mutation.call(self, self.state, data);
		this._subscribers.forEach(function(sub) {
			sub.call(self, mutation, self.state);
		});
	}
};

var accessor = {
	state: {}
};

accessor.state.get = function() {
	return this._vm.$data.$$state;
};
accessor.state.set = function() {};

Object.defineProperties(_proto_, accessor);

function mapMutations(mutations) {
	var res = {};
	mutations.forEach(function(mutation) {
		res[mutation] = function() {
			var args = [],
				len = arguments.length;
			while (len--) args[len] = arguments[len];
			return this.$store.commit.apply(this.$store, [mutation].concat(args));
		}
	});
	return res;
}

var MVVMX = {
	Store: Store,
	mapMutations: mapMutations
};

applyMixin();

export {
	MVVMX
};