<template>
    <div>
        <h3>child2</h3>
        <!-- $attrs -->
        <p>{{$attrs.msg}}</p>
        <p>{{bar1}}</p>
        <button @click="sendToChild1">给child1发送消息</button>
    </div>
</template>

<script>
    export default {
        inject:{
            bar1:{
                from:'bar',
                default:'barrrrrrr'
            }
        },
        methods: {
            sendToChild1(){
                // 利用事件总线发送事件
                this.$parent.$emit('event-from-child2','some msg from child2')

                this.$emit('foo')
            }
        },
    }
</script>

<style scoped>

</style>