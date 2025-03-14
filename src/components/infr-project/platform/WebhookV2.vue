<script lang="ts" setup>
import { ref, watch } from 'vue'

import type { Webhook } from './platform'

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
        <v-text-field v-model="editModel.name" label="Name" :readonly="true" :hideDetails="true">
            <template v-slot:append>
                <v-badge :color="editModel.activate ? 'green' : 'orange'"
                    :content="editModel.activate ? 'Activate' : 'Inactive'" inline></v-badge>
                <v-badge :color="editModel.followed ? 'green' : 'orange'"
                    :content="editModel.followed ? 'Followed' : 'Unfollowed'" inline></v-badge>
            </template>
        </v-text-field>
        <v-text-field v-model="editModel.url" label="URL" :readonly="true" :hideDetails="true" />
        <v-select label="State" v-model="editModel.state" :items="['Init', 'Creating', 'Ready']" :hideDetails="true"
            class="mt-2" :readonly="true"></v-select>
        <PropertyPage v-model="editModel.properties" :validate-manager="validateManager" :simple="true">
        </PropertyPage>
        <SecretPage v-model="editModel.secrets" :validate-manager="validateManager" :simple="true">
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
