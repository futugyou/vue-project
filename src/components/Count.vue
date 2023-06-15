<script  lang="ts" setup>
import { reactive, ref } from 'vue'

const counter = reactive({ count: 0 })
const message = ref('Hello World!')

const pClass = ref('title')
const increment = () => {
    counter.count++
    message.value="Count has been increment"
}
</script>

<template>
    <h1>{{ message }}</h1>
    <p :class="pClass">Count is: {{ counter.count }}</p>
    <button @click="increment">Increment Count</button>
</template>

<style>
.title {
    color: red;
}
</style>