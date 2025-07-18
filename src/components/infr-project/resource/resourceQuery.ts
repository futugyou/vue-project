
import { ref } from 'vue'
import { orderBy } from 'lodash-es'

import { useBaseQuery } from '@/composables/useBaseQuery'
import { ResourceApiFactory } from './resource'
import type { ResourceView, ResourceViewDetail } from './resource'

export const useResources = (alertError: boolean = true) => {
    return useBaseQuery<ResourceView[]>(
        ['resourceList'],
        async () => {
            const { data, error } = await ResourceApiFactory().v1ResourceGet()
            if (error) throw error
            return orderBy(data, 'updated_at', 'desc')
        },
        {
            alertError,
            idbName: 'resource',
            idbStoreName: 'datas',
            staleTime: 1000 * 60,
        }
    )
}

export const useResourceHistory = (resourceId: string, alertError: boolean = true) => {
    return useBaseQuery<ResourceViewDetail[]>(
        ['resource-history', resourceId],
        async () => {
            const { data, error } = await ResourceApiFactory().v1ResourceIdHistoryGet(resourceId)
            if (error) throw error
            return orderBy(data, 'version', 'desc')
        },
        {
            alertError,
            idbName: 'resource',
            idbStoreName: 'datas',
        }
    )
}

export const useResource = (resourceId: string, alertError: boolean = true) => {
    const id = resourceId?.trim()
    if (!id) {
        return { isPending: ref<boolean>(false), data: ref<ResourceViewDetail>() }
    }
    return useBaseQuery<ResourceViewDetail>(
        ['resource', resourceId],
        async () => {
            const { data, error } = await ResourceApiFactory().v1ResourceIdGet(id)
            if (error) throw error
            return data!
        },
        {
            alertError,
            idbName: 'resource',
            idbStoreName: 'datas',
            staleTime: 1000 * 60,             
        }
    )
}
