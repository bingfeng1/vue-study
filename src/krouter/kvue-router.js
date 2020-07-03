let KVue;

// 插件
// 1、实现一个install方法
class KVueRouter {
    constructor(options) {
        this.$options = options

        // 响应式数据
        const initial = window.location.hash.slice(1) || '/'

        //????????????????????????????????????????????????????
        KVue.util.defineReactive(this, 'current', initial)

        this.routeMap = {}
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })

        // 监听事件
        window.addEventListener('hashchange', this.onHashCnage.bind(this))
        window.addEventListener('load', this.onHashCnage.bind(this))
    }

    onHashCnage() {
        this.current = window.location.hash.slice(1)
    }
}

// 形参是Vue的构造函数
KVueRouter.install = (Vue) => {
    // 保存构造函数（这样就不用打包Vue了）
    KVue = Vue

    // 1、挂载$router
    Vue.mixin({
        beforeCreate() {
            // 全局混入，将来在组件实例化的时候才执行
            // 此时router实例已经存在
            if (this.$options.router) {
                // 挂载
                Vue.prototype.$router = this.$options.router
            }
        },
    })

    // 2.实现两个全局组件
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            },
        },
        render(h) {
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, this.$slots.default)
        }
    })
    Vue.component('router-view', {
        render(h) {
            // 获取路由实例
            const current = this.$router.current

            const {component} = this.$router.routeMap[current] || null

            return h(component)
        }
    })
}




export default KVueRouter