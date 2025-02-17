<script lang="ts" setup>
import { ref, watch } from 'vue'

import { Webhook } from './platform'

import { ValidateManager } from '@/tools/validate'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'

const props = defineProps<{
    model: Webhook
}>()

const editModel = ref<Webhook>(props.model)

const validateManager = ValidateManager()

watch(() => props.model, (newVal) => {
    editModel.value = newVal
})

</script>

<template>
    <v-card class="pa-3" v-if="editModel">
        <v-text-field v-model="editModel.name" label="Name" :readonly="true" :hideDetails="false" />
        <v-text-field v-model="editModel.url" label="URL" :readonly="true" :hideDetails="false" />
        <v-select label="State" v-model="editModel.state" :items="['Init', 'Creating', 'Ready']" :hideDetails="false"
            class="mt-2" :readonly="true"></v-select>
        <v-switch v-model="editModel.activate" label="Activate" class="pl-2" color="info" :hideDetails="false"
            :readonly="true" />
        <PropertyPage v-model="editModel.properties" :validate-manager="validateManager" :disabled="true">
        </PropertyPage>
        <SecretPage v-model="editModel.secrets" :validate-manager="validateManager" :disabled="true">
        </SecretPage>
    </v-card>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
