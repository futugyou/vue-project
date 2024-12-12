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
    emit('update:modelValue', newVal)
}, { deep: true })

const addProperty = () => {
    editModel.value.push({ key: '', value: '' })
    editModel.value = [...editModel.value]
}

const removeProperty = (index: number) => {
    editModel.value = [...editModel.value.filter((_, i) => i !== index)]
    props.validateManager.removeInputRef(`p-key-${index}`)
    props.validateManager.removeInputRef(`p-value-${index}`)
}

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
        <label class="v-label pl-3">Properties</label>
        <v-btn @click="addProperty()" variant="text" v-if="logined" :disabled="disabled" icon="md:add"></v-btn>
    </div>

    <v-row v-for="(property, index) in editModel" :key="index" class="mt-2">
        <v-col :cols="!disabled ? 4 : 5">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                :rules="validateManager.requiredMinMax('Property Key', 3, 150)" :hideDetails="false" :disabled="disabled" />
        </v-col>
        <v-col :cols="!disabled ? 4 : 5">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-value-${index}`)" v-model="property.value"
                label="Value" :rules="validateManager.requiredMinMax('Property Value', 3, 150)" :hideDetails="false"
                :disabled="disabled" />
        </v-col>
        <v-col cols="2" class="pt-4" v-if="logined">
            <v-btn icon="md:remove" @click="removeProperty(index)" :disabled="disabled"></v-btn>
        </v-col>
    </v-row>
</template>

<style scoped></style>
