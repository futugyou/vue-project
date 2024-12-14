<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    VaultApiFactory, VaultView, CreateVaultsRequest, StorageMediaEnum, VaultTypeEnum,
    VaultDefault, CreateVaultModel
} from './vault'

import { ValidateManager } from '@/tools/validate'
import FileInput from '@/common/FileInput.vue'

export interface VaultImportView {
    id: string
    storage_media: string
    tags: Array<string>
    type_identity: string
    vault_type: string
    force_insert: boolean
}

const DefaultVaultImportView: VaultImportView = {
    id: "",
    storage_media: "Local",
    tags: ["import"],
    type_identity: "common",
    vault_type: "common",
    force_insert: false,
}

const store = useMessageStore()
const { msg } = storeToRefs(store)


const authService = useAuth()
const validateManager = ValidateManager()
const isLoading = ref(false)

const editModel = ref<VaultImportView>(DefaultVaultImportView)
const parsedData = ref<Record<string, string>>({})

const cancel = () => {
    emit('cancel')
}

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    if (Object.keys(parsedData.value).length == 0) {
        return
    }

    const storage_media: unknown = editModel.value.storage_media ?? ""
    const vault_type: unknown = editModel.value.vault_type ?? ""

    var vaults: CreateVaultModel[] = []
    Object.entries(parsedData.value).forEach(([key, value]) => {
        vaults.push({
            key: key,
            value: value,
            storage_media: Object.values(StorageMediaEnum).includes(storage_media as StorageMediaEnum)
                ? (storage_media as StorageMediaEnum)
                : StorageMediaEnum.Local,
            tags: editModel.value.tags,
            type_identity: editModel.value.type_identity,
            vault_type: Object.values(VaultTypeEnum).includes(vault_type as VaultTypeEnum)
                ? (vault_type as VaultTypeEnum)
                : VaultTypeEnum.Common,
        })
    })

    const request: CreateVaultsRequest = {
        force_insert: editModel.value.force_insert,
        vaults: vaults,
    }

    isLoading.value = true
    const { data, error } = await VaultApiFactory().v1VaultPost(request)
    isLoading.value = false

    clear()
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    if (data) {
        if (data.vaults.length > 0) {
            emit('save', data.vaults)
        }
    }
}

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save', model: VaultView[]): void
}>()

const storageMediaOptions = computed(() =>
    Object.values(StorageMediaEnum).map((value) => ({
        label: value,
        value,
    }))
)

const vaultTypeOptions = computed(() =>
    Object.keys(VaultTypeEnum).map((key) => ({
        label: key,
        value: VaultTypeEnum[key as keyof typeof VaultTypeEnum],
    }))
)

onUnmounted(() => {
    validateManager.clearInputs()
})

const clear = () => {
    parsedData.value = {}
}


const onFileChange = async (fileList: FileList) => {
    clear()
    if (!fileList || fileList.length == 0) {
        return
    }

    Array.from(fileList).map(async (file) => {
        const content = await file.text()
        if (file.name !== ".env") {
            msg.value = {
                errorMessages: ["only support .env"],
                delay: 3000,
            }
            return
        }

        parsedData.value = content
            .toString()
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .reduce((acc, line) => {
                const [key, ...value] = line.split('=')
                acc[key.trim()] = value.join('=').trim()
                return acc;
            }, {} as Record<string, string>)
        // targer confirm-edit
        editModel.value.id = Date.now().toString()

    })
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100" v-if="!isLoading && authService.isAuthenticated()">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-sheet class="mb-5">
                        <FileInput @fileLoad="onFileChange" :IsLoading="isLoading" @clear="clear"></FileInput>
                    </v-sheet>

                    <v-table density="compact" v-if="parsedData">
                        <tbody>
                            <tr v-for="(value, key) in parsedData" :key="key">
                                <td>{{ key }}</td>
                                <td>{{ value }}</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-sheet class="d-flex align-center justify-space-between mb-4">
                        <v-switch v-model="proxyModel.value.force_insert" label="Force Insert" class="pl-2" color="info"
                            :hideDetails="true" />
                        <v-tooltip text="Force insert will allow the same key!" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon icon="md:info" v-bind="props" color="green-darken-2"></v-icon>
                            </template>
                        </v-tooltip>
                    </v-sheet>


                    <v-select :ref="el => validateManager.setInputRef(el, 'storage_media')"
                        :rules="validateManager.required('Storage Media')" v-model="proxyModel.value.storage_media"
                        class="mb-5" :items="storageMediaOptions" label="Storage Media" item-value="value"
                        item-title="label"></v-select>
                    <v-select :ref="el => validateManager.setInputRef(el, 'vault_type')"
                        :rules="validateManager.required('Vault Type')" v-model="proxyModel.value.vault_type" class="mb-5"
                        :items="vaultTypeOptions" label="Vault Type" item-value="value" item-title="label"></v-select>
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'type_identity')"
                        :rules="validateManager.createRule('Type Identity', { min: 3, max: 150, required: true })"
                        v-model="proxyModel.value.type_identity" label="Type Identity" :hideDetails="false" />
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :hideDetails="false"></v-combobox>
                    <v-sheet class="d-flex justify-end ga-3 pb-3">
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>
    </v-sheet>
</template>
