import 'pinia'
import { watch, Ref } from 'vue'
import { createPinia, PiniaPluginContext } from 'pinia'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        // 通过使用一个 setter，我们可以允许字符串和引用。
        set hello(value: string | Ref<string>)
        get hello(): string

        // 你也可以定义更简单的值
        secret: string
    }

    export interface PiniaCustomStateProperties<S> {
        hello1: string
    }

    export interface DefineStoreOptionsBase<S, Store> {
        // 任意 action 都允许定义一个防抖的毫秒数
        debounce?: Partial<Record<keyof StoreActions<Store>, number>>
      }
}

const SecretPiniaPlugin = ({ store }: PiniaPluginContext) => {
    store.secret = 'the cake is a lie'
}

// store is built using the setup syntax and does not implement $reset().
const Reset = ({ store }: PiniaPluginContext) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
        store.$state = JSON.parse(JSON.stringify(initialState));
    }
}

const HelloPlugin = ({ store }: PiniaPluginContext) => {
    store.hello = 'world'
    if (process.env.NODE_ENV === 'development') {
        // 添加你在 store 中设置的键值
        store._customProperties.add('hello')
    }
}

export const usePinia = () => {
    const pinia = createPinia()
    pinia.use(SecretPiniaPlugin)
    pinia.use(Reset)
    pinia.use(HelloPlugin)

    watch(
        pinia.state,
        (state) => {
            for (const key in state) {
                const value = state[key];
                localStorage.setItem('global_' + key, JSON.stringify(value))
            }
        },
        { deep: true }
    )

    return pinia
}