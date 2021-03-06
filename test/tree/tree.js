// demo data
var data = {
    name: 'My Tree',
    children: [{
        name: 'hello'
    }, {
        name: 'wat',
    }, {
        name: 'child folder',
        children: [{
            name: 'child folder',
            children: [{
                name: 'chello'
            }, {
                name: 'cwat'
            }]
        }, {
            name: 'hello'
        }, {
            name: 'wat'
        }, {
            name: 'child folder',
            children: [{
                name: 'hello'
            }, {
                name: 'wat'
            }]
        }]
    }]
}

// define the item component
MVVM.component('item', {
    template: '#item-template',
    props: {
        model: Object
    },
    data: function() {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function() {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function() {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function() {
            if (!this.isFolder) {
                MVVM.set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        addChild: function() {
            debugger;
            this.model.children.push({
                name: 'new stuff'
            });
        }
    }
})

// boot up the demo
var demo = new MVVM({
    el: '#demo',
    data: {
        treeData: data
    }
});

// setTimeout(function() {
//     data.children.push({
//         name: 'test'
//     });
// }, 3e3);