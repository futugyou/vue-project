import { VueQueryPlugin } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'

export { VueQueryPlugin }
export const vueQueryOptions: VueQueryPluginOptions = {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                gcTime: 1000 * 60 * 60 * 24,
                // staleTime: 1000 * 10, // 10 sec
                staleTime: 1000 * 60 * 60 * 1, // 1 hours
            },
        },
    },
}
