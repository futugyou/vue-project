
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { orderBy } from 'lodash-es'
import { useQuery } from '@tanstack/vue-query'
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'

import { useMessageStore } from '@/stores/message'
import { useIDBClient } from '@/composables/useIDBClientEx'

import { ResourceApiFactory } from './resource'
import type { ResourceView } from './resource'

export const useResources = (alertError: boolean = true) => {
    const store = useMessageStore()
    const { msg } = storeToRefs(store)
    const db = useIDBClient('resource', 'datas')

    const query = useQuery({
        queryKey: ['resourceList'],
        queryFn: async () => {
            const { data, error } = await ResourceApiFactory().v1ResourceGet()
            if (error) throw error
            return orderBy(data, 'updated_at', 'desc')
        },
        persister: experimental_createQueryPersister({
            storage: {
                getItem: (key: string) => db.getData<ResourceView[]>(key),
                setItem: (key: string, value: ResourceView[]) => db.setData(key, value),
                removeItem: (key: string) => db.deleteData(key),
            },
        }).persisterFn,
    })

    watch(
        () => query.error.value,
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

    return {
        ...query,
    }
}
