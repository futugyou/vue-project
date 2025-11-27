
import { ref } from 'vue'
import { orderBy } from 'lodash-es'

import { useBaseQuery } from '@/composables/useBaseQuery'
import { VaultApiFactory } from './vault'
import type { VaultView } from './vault'

export const useVaults = (alertError: boolean = true) => {
    return useBaseQuery<VaultView[]>(
        ['vaultList'],
        async () => {
            const { data, error } = await VaultApiFactory().v1VaultGet()
            if (error) throw error
            return orderBy(data, 'updated_at', 'desc')
        },
        {
            alertError,
            idbName: 'vaults',
            idbStoreName: 'datas',
            staleTime: 1000 * 60,
        }
    )
}