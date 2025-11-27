<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { orderBy, isEqual, cloneDeep } from 'lodash-es'

import { useAuth } from '@/plugins/auth'

import type { Secret } from './platform'
import type { ValidateManagerType } from '@/tools/validate'

import { VaultApiFactory } from '../vault/vault'
import { useVaults } from '../vault/vaultQuery'

const authService = useAuth()

const props = defineProps<{
    modelValue: Secret[],
    validateManager: ValidateManagerType,
    readonly?: boolean,
    simple?: boolean,
}>()

const logined = computed(() =>
    authService.isAuthenticated()
)

const editModel = ref<Secret[]>(props.modelValue ?? [])

const emit = defineEmits<{
    (e: 'update:modelValue', model: Secret[]): void
}>()

const addSecret = () => {
    const m = editModel.value
    m.push({ key: '', vault_id: '' })
    editModel.value = m
}

const removeSecret = (index: number) => {
    const m = editModel.value
    editModel.value = m.filter((_, i) => i !== index)
    props.validateManager.removeInputRef(`s-key-${index}`)
    props.validateManager.removeInputRef(`s-value-${index}`)
}

const { isPending: isLoading, data: vaultList, } = useVaults()

const vaultOptions = computed(() =>
    (vaultList.value ?? []).map((vault) => ({
        label: vault.key + " - " + vault.storage_media,
        value: vault.id,
    }))
)

watch(() => props.modelValue, (newVal) => {
    if (!isEqual(editModel.value, newVal)) {
        editModel.value = newVal
    }
}, { deep: true })

watch(editModel, (newVal) => {
    if (!isEqual(newVal, editModel)) {
        emit('update:modelValue', cloneDeep(newVal))
    }
}, { deep: true })

const readonly = computed(() => {
    if (props.readonly != undefined) {
        return props.readonly
    }
    return !logined.value
})

</script>

<template>
    <v-sheet class="elevation-3  pa-3">
        <div class="d-flex align-center ga-6 pb-3">
            <label class="v-label">Secrets</label>
            <v-btn @click="addSecret()" variant="text" v-if="!simple && logined" :readonly="readonly"
                icon="md:add"></v-btn>
        </div>

        <v-row v-for="(secret, index) in editModel" :key="index" v-if="!simple">
            <v-col :cols="logined ? 5 : 6">
                <v-text-field :ref="el => validateManager.setInputRef(el, `s-key-${index}`)" v-model="secret.key"
                    label="Key" :rules="validateManager.requiredMinMax('Secret Key', 3, 150)" :hideDetails="readonly"
                    :readonly="readonly" />
            </v-col>
            <v-col :cols="logined ? 5 : 6" class="d-flex align-start">
                <v-select :ref="el => validateManager.setInputRef(el, `s-value-${index}`)" v-model="secret.vault_id"
                    label="Value" :rules="validateManager.requiredMinMax('Secret Value', 3, 150)"
                    :hideDetails="readonly" :readonly="readonly" class="mb-5" :items="vaultOptions" item-value="value"
                    item-title="label"></v-select>
                <v-tooltip :text="secret.mask_value">
                    <template v-slot:activator="{ props }">
                        <v-icon icon="md:info" v-bind="props" class="ma-2"></v-icon>
                    </template>
                </v-tooltip>
            </v-col>
            <v-col cols="2" class="pt-2 d-flex align-center" v-if="logined">
                <v-btn icon="md:remove" @click="removeSecret(index)" :readonly="readonly"></v-btn>
            </v-col>
        </v-row>

        <v-table v-if="simple && editModel.length > 0" class="mb-2">
            <thead>
                <tr>
                    <th class="text-left">
                        Key
                    </th>
                    <th class="text-left">
                        Value
                    </th>
                    <th class="text-left">
                        Masked Value
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key) in editModel" :key="value.key">
                    <td class="">{{ value.key }}</td>
                    <td>{{ value.vault_key }}</td>
                    <td>{{ value.mask_value }}</td>
                </tr>
            </tbody>
        </v-table>

        <v-row v-if="editModel.length == 0" class="mb-2">
            <v-col>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<style scoped></style>
