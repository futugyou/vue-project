import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface MessageInfo {
    type?: string
    errorMessages?: string[]
    delay?: number
}

export const useMessageStore = defineStore('alert-messages', () => {
    const msg = ref<MessageInfo>({})

    return {
        msg
    }
})
