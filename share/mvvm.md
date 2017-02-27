title: Reactive Programming
speaker: 邓海龙
url: https://github.com/ksky521/nodePPT
transition: slide3
files: /js/demo.js,/css/demo.css,/js/zoom.js

[slide style="background-image:url('/img/bg1.png')"]
# Reactive Programming

[slide]

## Agenda
----
* Reactive {:&.rollIn}
* Directive
* Template
* Component

[slide]
## Excluded
----
* 语法 {:&.bounceIn}
* 使用
* 框架对比

[slide]
### state = f(state, action)
### view = f(state)

[slide]
## Reactive
----
* Dirty Check
* Setter
* `Object.defineProperty`

[slide style="background-image:url('/img/bg1.png')"]
## 监听property赋值，diff触发回调

[slide]
## Object.defineProperty
```javascript
Object.defineProperty(obj, key, {
	configurable: false,
	writable: true,
	set: function(value) {
		// obj[key] = xxx;
		// notify update
	},
	get: function() {
		// obj[key]
		// record dependency
	}
});
```

[slide]
## DEMO

[slide]
## Issue
----
* Add Dependency
* `Array.prototype.push` etc.


[slide]
## Directive
----
* Compiler
* Compute Expression

[slide]
## Compiler custom property (**`directive`**) and element (**`component`**)

[slide]
## Compute Expression
----
* Scope
* Filter && Bind


[slide]
## Dom Operation
----
* v-for
* v-if/else


[slide]
## Component
----
* Props Down
* Events Up

[slide]
## Dom Diff
```html
<div id="container">
	<p class="message">hello world</p>
	<h1 class="title">title</h1>
</div>
```

```javascript
new VNode({
	tagName: 'div',
	attributes: {id: 'container'},
	children: [
		new VNode({
			tagName: 'p',
			attributes: {class: 'message'},
			children: ['hello world']
		}),
		new Vnode({
			tagName: 'h1',
			attributes: {class: 'title'},
			children: ['title']
		})
	]
});
```