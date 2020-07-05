// 对象响应式原理
// 1、Object.defineProperty()

function defineReactive(obj, key, val) {
    // val可能是对象，需要递归处理
    observe(val)

    // 每执行一次defineReactive，就创建一个Dep实例
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val)

            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', newVal)

                observe(newVal)
                val = newVal

                // 通知更新
                dep.notify()
            }
        }
    })
}

function observe(obj) {
    // 判断obj类型必须是对象
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    // Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))

    new Observer(obj)
}

// 将$data中的key代理到KVue实例
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(v) {
                vm.$data[key] = v
            }
        })
    })

}

class KVue {
    constructor(options) {
        // 保存选项
        this.$options = options

        this.$data = options.data

        // 响应化操作
        observe(this.$data)

        // 代理
        proxy(this)

        // 编译
        new Compile('#app', this)
    }
}

// 每一个响应式对象，伴生一个Observer实例
class Observer {
    constructor(value) {
        this.value = value

        // 判断value是obj还是数组
        this.walk(value)

    }

    walk(obj) {
        Object.keys(obj)
            .forEach(key => defineReactive(obj, key, obj[key]))

    }
}


// 编译过程
// new Compile(el,vm)
class Compile {
    constructor(el, vm) {
        this.$vm = vm

        this.$el = document.querySelector(el)

        // 编译模板
        if (this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {
        // 递归遍历el
        // 判断其类型
        el.childNodes.forEach(node => {
            // 判断类型
            if (this.isElement(node)) {
                // console.log('编译元素', node.nodeName);
                this.compileElement(node)

            } else if (this.isInter(node)) {
                // console.log('编译插值表达式', node.textContent);
                this.compileText(node)

            }

            if (node.childNodes) {
                this.compile(node)
            }
        })

    }

    // 元素
    isElement(node) {
        // 元素
        return node.nodeType === 1
    }

    // 判断是否是插值表达式{{xxx}}
    isInter(node) {
        // 文本
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // 插值文本编译
    compileText(node) {
        // 获取匹配表达式
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }

    // 编译节点
    compileElement(node) {
        const nodeAttrs = node.attributes

        Array.from(nodeAttrs).forEach(attr => {
            // k-xxx=""
            const attrName = attr.name  // k-xxx
            const exp = attr.value  // aaa

            // 判断属性类型
            if (this.isDirective(attrName)) {
                const dir = attrName.substring(2)
                // 执行指令
                this[dir] && this[dir](node, exp)
            } else if (attrName.startsWith('@')) {
                // 截取事件
                const event = attrName.substring(1)
                console.log(node,event,this.$vm)
                // 绑定事件
                this.doEvent(node, event, this.$vm.$options.methods[exp])
            }

        })
    }

    isDirective(attrName) {
        return attrName.indexOf('k-') === 0
    }

    // 处理事件
    doEvent(node, event, method) {
        node.addEventListener(event, method.bind(this.$vm))
    }

    // 所有动态节点都需要创建更新函数，以及对应watcher实例
    update(node, exp, dir) {
        // 初始化
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])
        // 更新
        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val)
        })

    }

    // 文本指令
    text(node, exp) {
        this.update(node, exp, 'text')
    }

    textUpdater(node, value) {
        node.textContent = value
    }

    html(node, exp) {
        this.update(node, exp, 'html')
    }

    htmlUpdater(node, value) {
        node.innerHTML = value
    }
}

// Watcher 界面中的一个依赖对应一个Watcher
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm
        this.key = key
        this.updateFn = updateFn

        // 读一次数据，触发defineReactive里面的get()
        Dep.target = this
        this.vm[this.key]
        Dep.target = null

    }

    // 管家调用
    update() {
        // 传入当前最新的值给更新函数
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

class Dep {
    constructor() {
        this.deps = []
    }

    addDep(watcher) {
        this.deps.push(watcher)
    }

    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}