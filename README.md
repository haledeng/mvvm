# Contents
A MVVM test library for study. **Do not use in project**

### Main
+ compiler. Directives, filters and etc.
+ Define reactive property.
+ publish/subscribe.

### Function List
+ v-text
+ v-html
+ v-model
+ v-on/@
+ v-for
+ v-bind/:
+ v-if
+ $watch
+ v-show
+ computed property
+ template
+ Component
+ dom-diff


### Watcher
+ defineProperty监听属性的setter和getter方式，在getter中添加属性的依赖，
在setter中触发依赖的回调。
+ 数组的push,pop,shift等操作，需要重写。
+ defineProperty监听时，属性值如果是Object，需要继续监听。


### DOM Diff
+ DOM解析成对象 
```
	{
		tag: 'div', 
		props: {}, 
		children: [
			{
				tag:'p', 
				props: {}, 
				children[]
			}
		]
	}
```
+ 对比2个DOM的3个属性值，差异写入到Patch。
+ 根据patch，给原来的DOM打补丁。


### 指令解析
+ 解析字符串表达式，提取变量
+ 添加变量的依赖
+ 生成对应的DOM结构
+ dom-diff比对差异，patch增量
+ for和if的处理比较复杂，for中定义了临时变量，涉及作用域的问题


### history
##### fix state management
+ methods and computed中 this 指向了 vm.$data, 需要切换到vm；
	+ proxy， proxy all property from vm.$data into instance
+ store 目前挂在vm.$data上
	+ install store on VM, create a new instanca to watch state change. redefine state getter and setter.


### TODO List
+ change all directive context from vm.$data to vm.
+ more complex functions in state manager.
