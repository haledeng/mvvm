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
## Issue
----
* 添加依赖
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