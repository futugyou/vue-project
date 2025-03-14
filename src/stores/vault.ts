import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { VaultView } from '../components/infr-project/vault/vault'

export const useVaultStore = defineStore('vault-list-data', () => {
    const vaultList = ref<VaultView[]>([])

    const clearBody = () => {
        vaultList.value = []
    }

    return {
        vaultList,
        clearBody,
    }
})
