// composables/useQueryErrorLogger.ts
import { watch } from 'vue'
import type { WatchSource } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '@/stores/message'

export const useQueryErrorLogger = (errorSource: WatchSource<Error | null>, alertError: boolean = true) => {
    const store = useMessageStore()
    const { msg } = storeToRefs(store)

    watch(
        errorSource,
        (err) => {
            if (err && alertError) {
                msg.value = {
                    errorMessages: [err.message ?? 'request error'],
                    delay: 3000,
                }
            }
        },
        { immediate: true }
    )
}