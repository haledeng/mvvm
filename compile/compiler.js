'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _index = require('./directive/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {
    function Compiler(opts) {
        _classCallCheck(this, Compiler);

        this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
        this.$vm = opts.vm;
        this.init();
    }

    _createClass(Compiler, [{
        key: 'init',
        value: function init() {
            this.traversalNode(this.$el);
        }
    }, {
        key: 'traversalNode',
        value: function traversalNode(node) {
            // 遍历节点
            var self = this;
            var elements = node.getElementsByTagName('*');
            elements = [].slice.call(elements);
            elements.forEach(function (element) {
                self.traversalAttribute(element);
                if (self.isTextNode(element)) {
                    self.parseTextNode(element);
                }
            });
        }
    }, {
        key: 'traversalAttribute',
        value: function traversalAttribute(node) {
            var self = this;
            // 遍历属性
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var item = attrs[i];
                if (/^v\-([\w\:]*)/.test(item.name)) {
                    // async
                    (function (_item) {
                        self.bindWatch(self.$vm.$data, item.value, function () {
                            self._parseAttr(node, _item);
                        });
                    })(Object.assign({}, {
                        name: item.name,
                        value: item.value
                    }));

                    this._parseAttr(node, item);
                    this.addInputListener(node, item);
                }
            }
        }
    }, {
        key: '_parseAttr',
        value: function _parseAttr(node, attr) {
            // 转化属性
            var self = this;
            var attrReg = /^v\-([\w\:]*)/;
            var matches = attr.name.match(attrReg);
            // var tagName = node.tagName.toLowerCase();
            var property = matches[1];
            switch (property) {
                // v-model
                case 'model':
                    (0, _index.vModel)(node, self.$vm.$data, attr.value);
                    break;
                // v-text
                case 'text':
                    (0, _index.vText)(node, this.$vm.$data, attr.value);
                    break;
                case 'on:click':
                    // bind multy times
                    _index.vOn.call(this.$vm.$data, node, this.$vm.methods, attr.value);
                    break;
                default:
                    break;
            }
        }
    }, {
        key: 'addInputListener',
        value: function addInputListener(node, attr) {
            if (attr.name !== 'v-model') return;
            var key = attr.value;
            var oldVal = (0, _index.calculateExpression)(this.$vm.$data, key);
            // var oldVal = this.$vm.$data[key];
            var self = this;
            // v-model监听
            node.addEventListener('input', function () {
                if (node.value != oldVal) {
                    (0, _index.setScopeValue)(self.$vm.$data, key, node.value);
                    // self.$vm.$data[key] = node.value;
                }
            }, false);
        }
    }, {
        key: 'isTextNode',
        value: function isTextNode(node) {
            return node.children.length === 0 && node.childNodes.length !== 0;
        }
    }, {
        key: 'bindWatch',
        value: function bindWatch(vm, exp, callback) {
            var noop = function noop() {};
            new _watcher2.default({
                vm: vm,
                exp: exp,
                callback: callback || noop
            });
        }
    }, {
        key: 'parseTextNode',
        value: function parseTextNode(node) {
            var self = this;
            var html = node.innerHTML;
            var keys = [];
            var _replace = function _replace(scope) {
                var newHtml = html.replace(/\{\{([^\}]*)\}\}/g, function (all, name) {
                    if (!keys.length) {
                        keys.push(name);
                    }
                    name = _.trim(name);
                    return scope[name] || '';
                });
                node.innerHTML = newHtml;
            };
            _replace(this.$vm.$data);
            keys.forEach(function (key) {
                self.bindWatch(self.$vm.$data, key, _replace);
            });
        }
    }]);

    return Compiler;
}();

exports.default = Compiler;