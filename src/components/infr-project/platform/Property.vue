<script lang="ts" setup>
import { ref, watch } from 'vue'
import _ from 'lodash-es'

import { useAuth } from '@/plugins/auth'

import { Property } from './platform'
import { ValidateManagerType } from '@/tools/validate'

const authService = useAuth()

const props = defineProps<{
    model: Property[],
    validateManager: ValidateManagerType,
}>()

const editModel = ref<Property[]>(props.model)

const emit = defineEmits<{
    (e: 'update:model', model: Property[]): void
}>()

watch(editModel, (newVal) => {
    emit('update:model', newVal)
}, { deep: true })

const addProperty = () => {
    editModel.value.push({ key: '', value: '' })
    editModel.value = [...editModel.value]
}

const removeProperty = (index: number) => {
    editModel.value = [...editModel.value.filter((_, i) => i !== index)]
}

watch(() => props.model, (newVal) => {
    editModel.value = newVal
})

</script>

<template>
    <div class="d-flex align-center ga-6">
        <label class="v-label pl-3">Properties</label>
        <v-btn @click="addProperty()" variant="text" v-if="authService.isAuthenticated()" icon="md:add"></v-btn>
    </div>

    <v-row v-for="(property, index) in editModel" :key="index" class="mt-2">
        <v-col :cols="authService.isAuthenticated() ? 4 : 5">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                :rules="validateManager.requiredMinMax('Property Key', 3, 150)" :hideDetails="false"
                :disabled="!authService.isAuthenticated()" />
        </v-col>
        <v-col :cols="authService.isAuthenticated() ? 4 : 5">
            <v-text-field :ref="el => validateManager.setInputRef(el, `p-value-${index}`)" v-model="property.value"
                label="Value" :rules="validateManager.requiredMinMax('Property Value', 3, 150)" :hideDetails="false"
                :disabled="!authService.isAuthenticated()" />
        </v-col>
        <v-col cols="2" class="pt-4" v-if="authService.isAuthenticated()">
            <v-btn icon="md:remove" @click="removeProperty(index)"></v-btn>
        </v-col>
    </v-row>
</template>

<style scoped></style>
