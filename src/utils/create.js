import Vue from 'vue'
// 传入一个组件配置
// 创建他的实例，并且将它挂载到body上

function create(Component, props) {
    // 实例创建
    var Profile = Vue.extend(Component)

    const vm = new Profile({
        propsData:props
    }).$mount()

    console.log(vm)

    // 通过vm.$el获取生成的dom
    document.body.appendChild(vm.$el)


    // 删除函数
    // 获取到组价实例
    // const comp = vm.$children[0]
    
    // console.log(comp)

    vm.remove = ()=>{
        document.body.removeChild(vm.$el)
        vm.$destroy()
    }


    // const vm = new Vue({
    //     render(h) {
    //         return h(Component, { props })
    //     }
    // }).$mount()

    // // 通过vm.$el获取生成的dom
    // document.body.appendChild(vm.$el)

    // // 删除函数
    // // 获取到组价实例
    // const comp = vm.$children[0]

    // comp.remove = ()=>{
    //     document.body.removeChild(vm.$el)
    //     vm.$destroy()
    // }

    return vm
}

export default create