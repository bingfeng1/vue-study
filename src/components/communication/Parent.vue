<template>
  <div>
    <h3>parent</h3>
    <Child2 v-bind="$attrs" v-on="$listeners"></Child2>
  </div>
</template>

<script>
import Child2 from "@/components/communication/Child2";
export default {
  components: {
    Child2
  }
};
</script>

<style scoped>
</style>