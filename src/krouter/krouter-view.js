export default {
    render(h) {
        // 标记当前router-view深度
        this.$vnode.data.routerView = true

        // 标记router-view深度
        let depth = 0;
        let parent = this.$parent
        while (parent) {
            const vnodeData = parent.$vnode && parent.$vnode.data
            if (vnodeData) {
                if (vnodeData.routerView) {
                    // 说明是一个router-view
                    depth++

                }
            }

            parent = parent.$parent
        }

        // // const { routeMap, current } = this.$router;

        // console.log(routeMap, current)

        // const component = routeMap[current].component || null

        let component = null
        const route = this.$router.matched[depth]
        if(route){
            component = route.component
        }


        return h(component)
    }
}