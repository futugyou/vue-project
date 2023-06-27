<script lang="ts" setup>
import { useCounterStore } from '../../stores/counter'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
</script>


<template>
    <div class="vueapp-container">
        <div class="vueapp-layer">
            <h3>{{ store.count }}</h3>
            <button @click="store.increment">increment</button>
        </div>
    </div>
</template>