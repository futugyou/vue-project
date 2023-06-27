<script lang="ts" setup>
import { useCounterStore } from '../../stores/counter'
import { storeToRefs } from 'pinia'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
const { count } = storeToRefs(store)
const { increment } = store
const incrementClick = () => {
    store.count++
}

</script>


<template>
    <div class="vueapp-container">
        <div class="vueapp-layer">
            <h3>{{ store.count }}</h3>
            <button @click="store.increment">increment</button>
        </div>
        <div class="vueapp-layer">
            <h3>{{ count }}</h3>
            <button @click="increment">increment</button>
        </div>
        <div class="vueapp-layer">
            <h3>{{ count }}</h3>
            <button @click="incrementClick">click</button>
        </div>
    </div>
</template>