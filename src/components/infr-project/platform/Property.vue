<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import _ from 'lodash-es'

import { useAuth } from '@/plugins/auth'

import { Property } from './platform'
import { ValidateManagerType } from '@/tools/validate'

const authService = useAuth()

const props = defineProps<{
    modelValue: Property[],
    validateManager: ValidateManagerType,
    disabled?: boolean,
}>()

const editModel = ref<Property[]>(props.modelValue)

const emit = defineEmits<{
    (e: 'update:modelValue', model: Property[]): void
}>()

watch(editModel, (newVal) => {
    if (!_.isEqual(newVal, editModel)) {
        emit('update:modelValue', _.cloneDeep(newVal))
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
    if (!_.isEqual(editModel.value, newVal)) {
        editModel.value = newVal
    }
}, { deep: true })

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
        <label class="v-label pl-3">Properties</label>
        <v-btn @click="addProperty()" variant="text" v-if="logined" :disabled="disabled" icon="md:add"></v-btn>
    </div>

    <v-row v-for="(property, index) in editModel" :key="index" class="mt-2">
        <v-col :cols="!disabled ? 5 : 6">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                :rules="validateManager.requiredMinMax('Property Key', 3, 150)" :hideDetails="false" :disabled="disabled" />
        </v-col>
        <v-col :cols="!disabled ? 5 : 6">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-value-${index}`)" v-model="property.value"
                label="Value" :rules="validateManager.requiredMinMax('Property Value', 3, 150)" :hideDetails="false"
                :disabled="disabled" />
        </v-col>
        <v-col cols="2" class="pt-4" v-if="logined">
            <v-btn icon="md:remove" @click="removeProperty(index)" :disabled="disabled"></v-btn>
        </v-col>
    </v-row>
    <v-row v-if="editModel.length == 0" class="mt-2">
        <v-col>
        </v-col>
    </v-row>
</template>

<style scoped></style>
