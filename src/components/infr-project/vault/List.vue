<script lang="ts" setup>
import { ref, watchEffect, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { orderBy } from 'lodash-es'

import { useMessageStore } from '@/stores/message'
import { useVaultStore } from '@/stores/vault'
import { useAuth } from '@/plugins/auth'

import TableAndPaging from '@/common/TableAndPaging.vue'
import type { TableField } from '@/common/TableAndPaging.vue'
import Spinners from '@/common/Spinners.vue'
import { VaultApiFactory, VaultDefault } from './vault'
import type { VaultView } from './vault'
import VuetifyModal from '@/common/VuetifyModal.vue'

import Edit from './Edit.vue'
import Import from './Import.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const vaultStore = useVaultStore()
const { vaultList: vaults } = storeToRefs(vaultStore)
const authService = useAuth()

const vault = ref<VaultView>(VaultDefault)
const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const editPageTitle = ref("Create Vault")

const dialog = ref(false)
const dialogImport = ref(false)
const vaultRawDic = ref<{ key: string, value: string }[]>([])
const loadingState = ref<Record<string, boolean>>({})

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await VaultApiFactory().v1VaultGet()
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    vaults.value = orderBy(data, "key", "desc")
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const fields: TableField[] = [
    {
        key: 'key',
        label: 'Key'
    },
    {
        key: 'mask_value',
        label: 'Value (Mask Value)'
    },
    {
        key: 'storage_media',
        label: 'Storage Media'
    },
    {
        key: 'vault_type',
        label: 'Vault Type',
    },
    {
        key: 'type_identity',
        label: 'Type Identity'
    },
    {
        key: 'tags',
        label: 'Tags',
    }
]

const displayVault = async (id: string) => {
    if (!vaultValueIcon(id)) {
        vaultRawDic.value = vaultRawDic.value.filter(item => item.key !== id)
        return
    }

    loadingState.value[id] = true
    const { data, error } = await VaultApiFactory().v1VaultIdShowPost(id)
    loadingState.value[id] = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }
    vaultRawDic.value.push({ key: id, value: data! })
    vaultRawDic.value = [...vaultRawDic.value]
}

const formatVaultValue = (id: string, mask: string) => {
    var v = vaultRawDic.value.find(p => p.key == id)
    if (v) {
        return v.value
    }
    return mask
}

const vaultValueIcon = (id: string) => vaultRawDic.value.find(p => p.key == id) == undefined

const openVaultEdit = (body: VaultView) => {
    editPageTitle.value = "Edit Vault"
    dialog.value = true
    vault.value = body
}

const close = () => {
    dialog.value = false
    dialogImport.value = false
}

const valut_save = (newVault: VaultView) => {
    close()
    page.value = 1
    const index = vaults.value.findIndex(vault => vault.id === newVault.id)
    if (index !== -1) {
        vaults.value.splice(index, 1, newVault)
    } else {
        vaults.value.push(newVault)
    }
    vaults.value = [...vaults.value]
    const i = vaultRawDic.value.findIndex(p => p.key == newVault.id)
    if (i !== -1) {
        vaultRawDic.value.splice(index, 1)
        vaultRawDic.value = [...vaultRawDic.value]
    }
}

const valut_import = (newVaults: VaultView[]) => {
    close()
    page.value = 1
    Array.from(newVaults).map((newVault) => {
        vaults.value.push(newVault)
    })
    vaults.value = [...vaults.value]
}

const vault_delete = (vault_id: string) => {
    close()
    page.value = 1
    const index = vaults.value.findIndex(vault => vault.id === vault_id)
    if (index !== -1) {
        vaults.value.splice(index, 1)
    }
    vaults.value = [...vaults.value]
}

watch(dialog, (d) => {
    if (!d) {
        vault.value = VaultDefault
        editPageTitle.value = "Create Vault"
    }
})

const logined = computed(() =>
    authService.isAuthenticated()
)

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>Vault</v-toolbar-title>
            <v-spacer></v-spacer>
            <VuetifyModal v-model:dialog="dialogImport" text="Import Vaults" :width="700" :persistent="false"
                title="Import Vaults" hideFooter v-if="logined">
                <Import @save="valut_import" @cancel="close"></Import>
            </VuetifyModal>
            <div class="ml-4"></div>
            <VuetifyModal v-model:dialog="dialog" text="Create Vault" :width="700" :persistent="false"
                :title="editPageTitle" hideFooter v-if="logined">
                <Edit @save="valut_save" @cancel="close" :vault="vault" @delete="vault_delete"></Edit>
            </VuetifyModal>
        </v-toolbar>
        <Spinners v-if="isLoading"></Spinners>

        <TableAndPaging :items="vaults" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_key="body">
                <div>
                    <span v-if="logined" @click="openVaultEdit(body)" class="detail-link">
                        {{ body.key }}
                    </span>
                    <span v-else>
                        {{ body.key }}
                    </span>
                </div>
            </template>
            <template v-slot:body_mask_value="body">
                <div class="vault_value">
                    <span>
                        {{ formatVaultValue(body.id, body.mask_value) }}
                    </span>
                    <v-btn v-show="vaultValueIcon(body.id) && logined" icon="md:visibility" variant="text"
                        @click="displayVault(body.id)" :loading="loadingState[body.id]"></v-btn>
                    <v-btn v-show="!vaultValueIcon(body.id) && logined" icon="md:visibility_off" variant="text"
                        @click="displayVault(body.id)" :loading="loadingState[body.id]"></v-btn>
                </div>
            </template>
            <template v-slot:body_tags="body">
                <v-sheet class="d-flex flex-wrap ga-2">
                    <v-chip v-for="tag in body.tags">
                        <strong>{{ tag }}</strong>&nbsp;
                    </v-chip>
                </v-sheet>
            </template>
        </TableAndPaging>

    </v-sheet>
</template>

<style scoped>
a:active,
a:hover {
    outline-width: 0;
    background-color: transparent;
}

.vault_value {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
