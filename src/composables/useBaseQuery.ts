// composables/useBaseQuery.ts

import { useQuery } from '@tanstack/vue-query'
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'
import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'

import { useIDBClient, idbClientStorage } from '@/composables/useIDBClientEx'
import { useQueryErrorLogger } from '@/composables/useQueryErrorLogger'

interface BaseQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
    alertError?: boolean
    idbName: string
    idbStoreName: string
    staleTime?: number
}

export const useBaseQuery = <TData>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: BaseQueryOptions<TData>
) => {
    const { alertError = true, idbName = 'app-data', idbStoreName = 'cache', ...restOptions } = options || {}

    const idb = useIDBClient(idbName, idbStoreName)

    const query = useQuery<TData>({
        queryKey,
        queryFn,
        persister: experimental_createQueryPersister({
            storage: idbClientStorage<TData>(idb),
        }).persisterFn,
        ...restOptions,
    })

    useQueryErrorLogger(query.error, alertError)

    return query
};