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
* Component
* dom-diff

[slide]
## Excluded
----
* 语法 {:&.bounceIn}
* 使用
* 框架对比

[slide]
### state = f(state, action)
### view = f(state)

[slide style="background-image:url('/img/bg1.png')"]
## Reactive

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
## DEMO


[slide]
## Component
----
* template + data + style


[slide]
## Dom Operation
----
* react
```
<div id="main" class="container">
	<p>hello world</p>
</div>
```

```
{
	tagName: 'div',
	attrs: {className: 'container', id: 'main'},
	children: [{
		tagName: 'p',
		attrs: {},
		children: ['hello world']
	}]
}
```
* dom-diff
