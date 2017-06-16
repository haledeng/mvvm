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


### history
##### fix state management
+ methods and computed中 this 指向了 vm.$data, 需要切换到vm；
	+ proxy， proxy all property from vm.$data into instance
+ store 目前挂在vm.$data上
	+ install store on VM, create a new instanca to watch state change. redefine state getter and setter.


TODO:
+ 嵌套Component
