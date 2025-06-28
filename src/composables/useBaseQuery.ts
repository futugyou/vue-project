// composables/useBaseQuery.ts

import { useQuery, useMutation } from '@tanstack/vue-query'
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'
import type { QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/vue-query'
import type { DefaultError } from '@tanstack/query-core'

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
}

interface BaseMutationOptions<TVariables, TData>
    extends Omit<UseMutationOptions<TData, DefaultError, TVariables>, 'mutationFn'> {
    alertError?: boolean
}

// I usually don't choose to use useMutation.
// The benefit of using useMutation may only be to handle errors by the way.
export const useBaseMutation = <TVariables, TData>(
    mutationFn: (a: TVariables) => Promise<TData>,
    options?: BaseMutationOptions<TVariables, TData>
) => {
    const { alertError = true, ...restOptions } = options || {}
    const mutate = useMutation({
        mutationFn: mutationFn,
        ...restOptions,
    })

    useQueryErrorLogger(mutate.error, alertError)

    return mutate
}
