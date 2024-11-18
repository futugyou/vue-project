<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import { VaultApiFactory, VaultView } from './vault'

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

const save = () => {
    //TODO: save vault
    emit('save', editModel.value)
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

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" minHeight="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100" v-if="!isLoading && authService.isAuthenticated()">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => setInputRef(el, 'id')" v-model="proxyModel.value.id" label="Id" disabled
                        :hideDetails="false" v-if="proxyModel.value.id != ''" />
                    <v-text-field :ref="el => setInputRef(el, 'key')" v-model="proxyModel.value.key" label="Key"
                        :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'mask_value')" v-model="proxyModel.value.mask_value"
                        label="Mask Value" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'storage_media')" v-model="proxyModel.value.storage_media"
                        label="Storage Media" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'vault_type')" v-model="proxyModel.value.vault_type"
                        label="Vault Type" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'type_identity')" v-model="proxyModel.value.type_identity"
                        label="Type Identity" :hideDetails="false" />
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
