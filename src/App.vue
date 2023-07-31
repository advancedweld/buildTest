<template>
  <h1>hello, xiang</h1>
  <h2>
    <span>count is {{ count }}</span>
    <button @click="count++">+1</button>
  </h2>
</template>

<script setup>
import { ref } from "vue";
const count = ref(0);
</script>
