<script  lang="ts" setup>
import { reactive, ref } from 'vue'

const counter = reactive({ count: 0 })
const message = ref('Hello World!')

const pClass = ref('title')
const increment = () => {
    counter.count++
}

const OnInput = (e: any) => {
    message.value = e.target.value
}
</script>

<template>
    <h1>{{ message }}</h1>
    <p :class="pClass">Count is: {{ counter.count }}</p>
    <button @click="increment">Increment Count</button>
    <input :value="message" @input="OnInput" placeholder="Hello World!" />
    <input v-model="message" placeholder="Hello World!" />
</template>

<style>
.title {
    color: red;
}
</style>