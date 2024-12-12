<script lang="ts" setup>
import { ref, watch, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import { useAuth } from '@/plugins/auth'
import { useVaultStore } from '@/stores/vault'

import { Secret } from './platform'
import { ValidateManagerType } from '@/tools/validate'

import { VaultApiFactory } from '../vault/vault'

const authService = useAuth()
const vaultStore = useVaultStore()
const { vaultList } = storeToRefs(vaultStore)

const props = defineProps<{
    modelValue: Secret[],
    validateManager: ValidateManagerType,
    disabled?: boolean,
}>()

const editModel = ref<Secret[]>(props.modelValue)

const emit = defineEmits<{
    (e: 'update:modelValue', model: Secret[]): void
}>()

watch(editModel, (newVal) => {
    emit('update:modelValue', newVal)
}, { deep: true })

const addSecret = () => {
    editModel.value.push({ key: '', vault_id: '' })
    editModel.value = [...editModel.value]
}

const removeSecret = (index: number) => {
    editModel.value = [...editModel.value.filter((_, i) => i !== index)]
    props.validateManager.removeInputRef(`s-key-${index}`)
    props.validateManager.removeInputRef(`s-value-${index}`)
}

const vaultOptions = computed(() =>
    vaultList.value.map((vault) => ({
        label: vault.key + " - " + vault.storage_media,
        value: vault.id,
    }))
)

const fetchVaultData = async () => {
    if (vaultList.value.length > 0) {
        return
    }
    const { data, error } = await VaultApiFactory().v1VaultGet()
    if (error) {
        vaultList.value = []
        return
    }

    vaultList.value = _.orderBy(data, "key", "desc")
}

watchEffect(async () => fetchVaultData())

watch(() => props.modelValue, (newVal) => {
    editModel.value = newVal
})

const disabled = computed(() => {
    if (props.disabled != undefined) {
        return props.disabled
    }
    return !logined.value
})

const logined = computed(() =>
    authService.isAuthenticated()
)

</script>

<template>
    <div class="d-flex align-center ga-6">
        <label class="v-label pl-3">Secrets</label>
        <v-btn @click="addSecret()" variant="text" v-if="logined" icon="md:add" :disabled="disabled"></v-btn>
    </div>

    <v-row v-for="(secret, index) in editModel" :key="index" class="mt-2">
        <v-col :cols="!disabled ? 4 : 5">
            <v-text-field :ref="el => validateManager.setInputRef(el, `s-key-${index}`)" v-model="secret.key" label="Key"
                :rules="validateManager.requiredMinMax('Secret Key', 3, 150)" :hideDetails="false" :disabled="disabled" />
        </v-col>
        <v-col :cols="!disabled ? 4 : 5">
            <v-select :ref="el => validateManager.setInputRef(el, `s-value-${index}`)" v-model="secret.vault_id"
                label="Value" :rules="validateManager.requiredMinMax('Secret Value', 3, 150)" :hideDetails="false"
                :disabled="disabled" class="mb-5" :items="vaultOptions" item-value="value" item-title="label"></v-select>
        </v-col>
        <v-col cols="2" class="pt-4" v-if="logined">
            <v-btn icon="md:remove" @click="removeSecret(index)" :disabled="disabled"></v-btn>
        </v-col>
    </v-row>
</template>

<style scoped></style>
