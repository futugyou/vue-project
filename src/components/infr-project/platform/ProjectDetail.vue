<script lang="ts" setup>
import { ref, watch, onUnmounted, computed, watchEffect } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import MarkdownBadge from '@/common/MarkdownBadge.vue'
import { useMessageStore } from '@/stores/message'

import WebhookPage from './WebhookV2.vue'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'
import { timeFormat } from '@/tools/timeFormat'

import {
    OperateEnum, PlatformApiFactory, PlatformProject
} from './platform'
import { ValidateManager } from '@/tools/validate'

const route = useRoute()
const store = useMessageStore()
const { msg } = storeToRefs(store)

const validateManager = ValidateManager()

const platformId = route.params.id as string
const projectId = route.params.projectId as string

const isLoading = ref(false)
const model = ref<PlatformProject>()

const loadDetail = async () => {
    if (isLoading.value) {
        return
    }

    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdGet(platformId, projectId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    model.value = data
}

loadDetail()

onUnmounted(() => {
    validateManager.clearInputs()
})

const operateOptions = computed(() =>
    Object.keys(OperateEnum).map((key) => ({
        label: key,
        value: OperateEnum[key as keyof typeof OperateEnum],
    }))
)

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="h-100 overflow-y-auto" v-if="!isLoading && model">
            <template v-slot:title>
                <v-sheet class="d-flex ga-3">
                    <p class="text-h5 font-weight-black">{{ model.name }}</p>
                    <a :href="model.url" target="_blank" class="ga-6 py-1 px-2">
                        <v-hover>
                            <template v-slot:default="{ props }">
                                <!-- {{ model?.url }} -->
                                <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                            </template>
                        </v-hover>
                    </a>
                </v-sheet>
            </template>
            <template v-slot:append>
                <v-badge :color="model?.followed ? 'green' : 'orange'"
                    :content="model?.followed ? 'Followed' : 'Unfollowed'" inline></v-badge>
            </template>
            <v-card-text>
                <v-sheet class="d-flex flex-column ga-3">
                    <v-sheet class="d-flex flex-column pa-3 ga-3 elevation-3">
                        <label class="v-label">Description</label>
                        <div class="text-medium-emphasis">{{ model?.description }}</div>
                    </v-sheet>

                    <PropertyPage :modelValue="model.properties ?? []" :validate-manager="validateManager"
                        :disabled="true">
                    </PropertyPage>
                    <SecretPage :modelValue="model.secrets ?? []" :validate-manager="validateManager" :disabled="true">
                    </SecretPage>

                    <v-expansion-panels v-if="model.webhooks" class="elevation-3" :static="true">
                        <v-expansion-panel title="Webhooks">
                            <v-expansion-panel-text>
                                <v-row>
                                    <v-col v-for="webhook in model.webhooks" :key="webhook.name" cols="12" md="4">
                                        <WebhookPage :model="webhook"></WebhookPage>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-sheet>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<style scoped>
.v-window {
    width: 100%;
    height: 100%;
}

.v-window-item {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
