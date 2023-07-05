import { onMounted, onBeforeUnmount } from 'vue'

export const useEventListener = (target: any, event: any, callback: any) => {
    onMounted(() => target.addEventListener(event, callback))
    onBeforeUnmount(() => target.removeEventListener(event, callback))
}
