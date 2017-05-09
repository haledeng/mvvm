var STORAGE_KEY = 'vuex-todos';
var state = {
	todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
};
var store = new MVVMX.Store({
	state: state,
	mutations: {
		deleteTodo: function(state, obj) {
			state.todos.splice(state.todos.indexOf(obj.todo), 1);
		},
		addTodo: function(state, obj) {
			obj.id = state.todos.length;
			obj.done = false;
			state.todos.push(obj);
		},
		toggleTodo: function(state, obj) {
			obj.todo.done = !obj.todo.done;
		},
		editTodo: function(state, obj) {
			obj.todo.text = obj.value;
		},
		clearCompleted: function(state) {
			state.todos = state.todos.filter(function(todo) {
				return !todo.done;
			});
		},
		toggleAll: function(state) {
			state.todos.forEach(function(todo) {
				todo.done = !todo.done;
			});
		}
	},
	plugins: [
		function(store) {
			store.subscribe(function(mutation, state) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
			});
		}
	]
});



var filters = {
	all: function(todos) {
		return todos;
	},
	active: function(todos) {
		debugger;
		return todos.filter(function(todo) {
			return !todo.done;
		});
	},
	completed: function(todos) {
		debugger;
		return todos.filter(function(todo) {
			return todo.done;
		});
	}
};
var maps = MVVMX.mapMutations(['clearCompleted', 'toggleAll']);
var methods = Object.assign({
	change: function(key) {
		this.visibility = key;
	},
	deleteTodo: function(obj) {
		this.$store.commit('deleteTodo', obj);
	},
	addTodo: function(e) {
		var text = e.target.value;
		if (text.trim()) {
			this.$store.commit('addTodo', {
				text: text
			});
		}
		e.target.value = '';
	},
	toggleTodo: function(obj) {
		this.$store.commit('toggleTodo', obj);
	},
	doneEdit: function(e) {
		var target = e.target;
		var text = target.value.trim();
		var id = target.getAttribute('data-id');
		var todo = this.$store.state.todos.filter(function(todo) {
			return todo.id == id;
		});
		todo = todo[0] || [];
		if (!text) {
			this.$store.commit('deleteTodo', {
				todo: todo
			});
		} else if (this.editing) {
			this.$store.commit('editTodo', {
				todo: todo,
				value: text
			});
			this.editing = false;
		}
	},
	cancelEdit: function(e) {
		e.target.value = this.todo.text;
		this.editing = false;
	},
}, maps);

var app = new MVVM({
	el: '#todoapp',
	store: store,
	data: {
		editing: false,
		visibility: 'all',
		filters: filters,
	},
	computed: {
		todos: function() {
			return filters[this.visibility](this.$store.state.todos);
		},
		allChecked: function() {
			return this.$store.state.todos.every(function(todo) {
				return todo.done;
			});
		},
		remaining: function() {
			return this.$store.state.todos.filter(function(todo) {
				return !todo.done
			}).length
		},
	},
	methods: methods
});