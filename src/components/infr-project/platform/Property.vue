<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { isEqual, cloneDeep } from 'lodash-es'

import { useAuth } from '@/plugins/auth'

import type { Property } from './platform'
import type { ValidateManagerType } from '@/tools/validate'

const authService = useAuth()

const props = defineProps<{
    modelValue: Property[],
    validateManager: ValidateManagerType,
    readonly?: boolean,
    simple?: boolean,
}>()

const editModel = ref<Property[]>(props.modelValue ?? [])

const emit = defineEmits<{
    (e: 'update:modelValue', model: Property[]): void
}>()

watch(editModel, (newVal) => {
    if (!isEqual(newVal, editModel)) {
        emit('update:modelValue', cloneDeep(newVal))
    }
}, { deep: true })

const addProperty = () => {
    const m = editModel.value
    m.push({ key: '', value: '' })
    editModel.value = m
}

const removeProperty = (index: number) => {
    const m = editModel.value
    editModel.value = m.filter((_, i) => i !== index)
    props.validateManager.removeInputRef(`p-key-${index}`)
    props.validateManager.removeInputRef(`p-value-${index}`)
}

watch(() => props.modelValue, (newVal) => {
    if (!isEqual(editModel.value, newVal)) {
        editModel.value = newVal
    }
}, { deep: true })

const readonly = computed(() => {
    if (props.readonly != undefined) {
        return props.readonly
    }
    return !logined.value
})

const logined = computed(() =>
    authService.isAuthenticated()
)

</script>

<template>
    <v-sheet class="elevation-3  pa-3">
        <div class="d-flex align-center ga-6 pb-3">
            <label class="v-label">Properties</label>
            <v-btn @click="addProperty()" variant="text" v-if="!simple && logined" :readonly="readonly"
                icon="md:add"></v-btn>
        </div>

        <v-row v-for="(property, index) in editModel" :key="index" v-if="!simple">
            <v-col :cols="logined ? 5 : 6">
                <v-text-field :ref="el => validateManager.setInputRef(el, `p-key-${index}`)" v-model="property.key"
                    label="Key" :rules="validateManager.requiredMinMax('Property Key', 3, 150)" :hideDetails="readonly"
                    :readonly="readonly" />
            </v-col>
            <v-col :cols="logined ? 5 : 6">
                <v-text-field :ref="el => validateManager.setInputRef(el, `p-value-${index}`)" v-model="property.value"
                    label="Value" :rules="validateManager.requiredMinMax('Property Value', 3, 150)"
                    :hideDetails="readonly" :readonly="readonly" />
            </v-col>
            <v-col cols="2" class="pt-2 d-flex align-center" v-if="logined">
                <v-btn icon="md:remove" @click="removeProperty(index)" :readonly="readonly"></v-btn>
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key) in editModel" :key="value.key">
                    <td class="">{{ value.key }}</td>
                    <td>{{ value.value }}</td>
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
