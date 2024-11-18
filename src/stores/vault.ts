import { ref } from 'vue'
import { defineStore } from 'pinia'

import { VaultView, VaultDefault } from '../components/infr-project/vault/vault'

export const useVaultStore = defineStore('vault-data', () => {
    const vault = ref<VaultView>(VaultDefault)

    const clearBody = () => {
        vault.value = VaultDefault
    }

    return {
        vault,
        clearBody,
    }
})
