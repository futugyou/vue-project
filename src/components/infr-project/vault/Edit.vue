<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    VaultApiFactory, VaultView, CreateVaultsRequest, ChangeVaultRequest, StorageMediaEnum, VaultTypeEnum,
    CreateVaultsResponse
} from './vault'
import { fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck } from '@/tools/util'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()

const isLoading = ref(false)

const props = defineProps<{
    vault: VaultView
}>()
const editModel = ref<VaultView>(_.cloneDeep(props.vault))

const cancel = () => {
    emit('cancel')
}

const save = async () => {
    let validateMsg: string[] = []
    for (const key in inputRefs.value) {
        const input = inputRefs.value[key]
        if (input) {
            const message: string[] = await input.validate(false)
            if (message && message.length > 0) {
                validateMsg = [...validateMsg, ...message]
            }
        }
    }

    if (validateMsg.length > 0) {
        return
    }
    
    isLoading.value = true
    const storage_media: unknown = editModel.value.storage_media ?? ""
    const vault_type: unknown = editModel.value.vault_type ?? ""
    let response
    let item = {
        key: editModel.value.key,
        value: editModel.value.mask_value,
        storage_media: Object.values(StorageMediaEnum).includes(storage_media as StorageMediaEnum)
            ? (storage_media as StorageMediaEnum)
            : StorageMediaEnum.Local,
        tags: editModel.value.tags,
        type_identity: editModel.value.type_identity,
        vault_type: Object.values(VaultTypeEnum).includes(vault_type as VaultTypeEnum)
            ? (vault_type as VaultTypeEnum)
            : VaultTypeEnum.Common,
    }

    if (editModel.value.id == '') {
        const request: CreateVaultsRequest = {
            force_insert: false,
            vaults: [item]
        }
        response = await VaultApiFactory().v1VaultPost(request)
    } else {
        const request: ChangeVaultRequest = {
            force_insert: false,
            vault_data: item
        }
        response = await VaultApiFactory().v1VaultIdPut(editModel.value.id, request)
    }

    const { data, error } = response
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message ?? error],
            delay: 3000,
        }
        return
    }

    if (data) {
        if ("vaults" in data) {
            const vaultView = data as CreateVaultsResponse
            if (vaultView.vaults.length > 0) {
                emit('save', vaultView.vaults[0])
            }
        } else {
            const vaultView = data as VaultView
            emit('save', vaultView)
        }
    }
}

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save', model: VaultView): void
}>()

watch(() => props.vault, (newVal) => {
    editModel.value = _.cloneDeep(newVal)
})

const inputRefs = ref<{ [key: string]: any }>({})
const setInputRef = (el: any, key: string) => {
    inputRefs.value[key] = el
}

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


const rules = {
    key: [(value: string) => fieldRequiredCheck(value, 'Key'), (value: string) => fieldMinLengthCheck(value, 'Key', 3), (value: string) => fieldMaxLengthCheck(value, 'Key', 150),],
    mask_value: [(value: string) => fieldRequiredCheck(value, 'mask value'), (value: string) => fieldMinLengthCheck(value, 'mask value', 3), (value: string) => fieldMaxLengthCheck(value, 'mask_value', 150),],
    storage_media: [(value: string) => fieldRequiredCheck(value, 'storage media')],
    vault_type: [(value: string) => fieldRequiredCheck(value, 'vault type')],
    type_identity: [(value: string) => fieldRequiredCheck(value, 'type identity'), (value: string) => fieldMinLengthCheck(value, 'type identity', 3), (value: string) => fieldMaxLengthCheck(value, 'type identity', 150),],
}


</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" minHeight="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100" v-if="!isLoading && authService.isAuthenticated()">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => setInputRef(el, 'id')" v-model="proxyModel.value.id" label="Id" disabled
                        :hideDetails="false" v-if="proxyModel.value.id != ''" />
                    <v-text-field :ref="el => setInputRef(el, 'key')" :rules="rules.key" v-model="proxyModel.value.key"
                        label="Key" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'mask_value')" :rules="rules.mask_value"
                        v-model="proxyModel.value.mask_value" label="Value (Mask Value)" :hideDetails="false" />
                    <v-select :ref="el => setInputRef(el, 'storage_media')" :rules="rules.storage_media"
                        v-model="proxyModel.value.storage_media" class="mb-5" :items="storageMediaOptions"
                        label="Storage Media" item-value="value" item-title="label"></v-select>
                    <v-select :ref="el => setInputRef(el, 'vault_type')" :rules="rules.vault_type"
                        v-model="proxyModel.value.vault_type" class="mb-5" :items="vaultTypeOptions" label="Vault Type"
                        item-value="value" item-title="label"></v-select>
                    <v-text-field :ref="el => setInputRef(el, 'type_identity')" :rules="rules.type_identity"
                        v-model="proxyModel.value.type_identity" label="Type Identity" :hideDetails="false" />
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :hideDetails="false"></v-combobox>
                    <v-sheet class="d-flex justify-end ga-3">
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>
    </v-sheet>
</template>
