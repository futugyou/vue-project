import { VueQueryPlugin } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'

import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'

const persister = experimental_createQueryPersister({
    storage: localStorage,
    maxAge: 1000 * 60 * 60 * 12, // 12 hours
})

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
                persister: persister.persisterFn,
            },
        },
    },
}
