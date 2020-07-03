<template>
  <div>
    <Child1 msg="some msg from parent" @some-event="onSomeEvent" />
    <Child2 ref="child2" msg="some message"/>

    <Parent msg="msg from grandpa" @foo="onFoo"></Parent>
  </div>
</template>

<script>
import Child1 from "@/components/communication/Child1";
import Child2 from "@/components/communication/Child2";
import Parent from "@/components/communication/Parent";
export default {
  components: {
    Child1,
    Child2,
    Parent
  },
  provide(){
      return {
          bar:'bar2'
      }
  },
  methods: {
    onSomeEvent(msg) {
      console.log("Communition:", msg);
    },
    onFoo(){
        console.log('Child2 $listener')
    }
  },
  mounted () {
    //   this.$children[1].sendToChild1();
    this.$refs.child2.sendToChild1()
  },
};
</script>