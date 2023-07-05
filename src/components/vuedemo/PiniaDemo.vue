<script lang="ts" setup>
import { useCounterStore } from '../../stores/counter'
import { useUserStore } from '../../stores/user'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
const unsubscribe = store.$onAction(
    ({
        name, // action 名称
        store, // store 实例，类似 `someStore`
        args, // 传递给 action 的参数数组
        after, // 在 action 返回或解决后的钩子
        onError // action 抛出或拒绝的钩子
    }) => {
        // 为这个特定的 action 调用提供一个共享变量
        const startTime = Date.now()
        // 这将在执行 "store "的 action 之前触发。
        console.log(`Start "${name}" with params [${args.join(', ')}].`)

        // 这将在 action 成功并完全运行后触发。
        // 它等待着任何返回的 promise
        after((result) => {
            console.log(`Finished "${name}" after ${Date.now() - startTime}ms.\nResult: ${result}.`)
        })

        // 如果 action 抛出或返回一个拒绝的 promise，这将触发
        onError((error) => {
            console.warn(`Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`)
        })
    }
)

const { count } = storeToRefs(store)
const { increment } = store
const incrementClick = () => {
    store.count++
}

const reset = () => {
    store.$reset()
}

const change = () => {
    store.$state = { count: 24, hello1: '' }
    // 在它内部调用 `$patch()`：
    //store.$patch({ count: 24 })
}

store.$subscribe((mutation, state) => {
    // 'direct' | 'patch object' | 'patch function'
    console.log(mutation.type)
    console.log(mutation.storeId)

    localStorage.setItem('counter', JSON.stringify(state))
})

const count2 = ref(0)
const countAdd = () => {
    count2.value = store.countAdd(9)
}

const userData = ref(null)
const getUserData = async () => {
    userData.value = await store.getUserDataById(count.value)
}

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
        <div class="vueapp-layer">
            <h3>{{ count2 }}</h3>
            <button @click="countAdd">countAdd</button>
        </div>
        <div class="vueapp-layer">
            <h3>
                <pre>{{ userData }}</pre>
            </h3>
            <button @click="getUserData">get user data</button>
        </div>
        <div class="vueapp-layer">
            <h3>plugins</h3>
            <div>{{ store.secret }}</div>
            <div>{{ store.hello }}</div>
        </div>
        <div class="vueapp-layer">
            <h3>User</h3>
            <div>{{ user.name }}</div>
            <div>{{ user.age }}</div>
        </div>
    </div>
</template>
