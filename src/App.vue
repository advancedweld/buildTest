<template>
  <h1>hello, xiang</h1>
  <h2>
    <span>count is {{ count }}</span>
    <button @click="count++">+1</button>
  </h2>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  setup() {
    const count = ref(0);
    return {
      count,
    };
  },
};
</script>
