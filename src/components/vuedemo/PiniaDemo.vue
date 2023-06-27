<script lang="ts" setup>
import { useCounterStore } from '../../stores/counter'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
const { count } = storeToRefs(store)
const { increment } = store
const incrementClick = () => {
    store.count++
}

const reset = () => {
    store.$reset()
}

const change = () => {
    store.$state = { count: 24 }

    // 在它内部调用 `$patch()`：
    //store.$patch({ count: 24 })
}

store.$subscribe((mutation, state) => {
    // 'direct' | 'patch object' | 'patch function'
    console.log(mutation.type)
    console.log(mutation.storeId)

    localStorage.setItem('counter', JSON.stringify(state))
})

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
        <div class="vueapp-layer">
            <h3>{{ count }}</h3>
            <button @click="reset">reset</button>
        </div>
        <div class="vueapp-layer">
            <h3>{{ count }}</h3>
            <button @click="change">change</button>
        </div>
    </div>
</template>