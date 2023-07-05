import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface UserInfo {
    name: string
    age: number
}

export const useUserStore = defineStore('user', () => {
    const demouser: UserInfo = {
        name: 'tom',
        age: 20
    }

    const user = useLocalStorage('pinia/auth/login', demouser)

    return {
        user
    }
})
