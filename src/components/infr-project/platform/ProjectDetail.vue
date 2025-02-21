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

const tab = ref("one")
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

    tab.value = "one"
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
    <v-sheet class="d-flex flex-column ga-3 pa-3" height="100%">
        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Basic</v-tab>
            <v-tab value="two">Provider</v-tab>
        </v-tabs>
        <Spinners v-if="isLoading"></Spinners>
        <v-tabs-window v-model="tab" v-if="!isLoading && model">
            <v-tabs-window-item value="one">
                <v-card class="h-100 overflow-y-auto d-flex flex-column">
                    <template v-slot:title>
                        <v-sheet class="d-flex ga-3">
                            <p class="text-h5 font-weight-black">{{ model.name }}</p>
                            <a :href="model.url" target="_blank" class="ga-6 py-1 px-2">
                                <v-hover>
                                    <template v-slot:default="{ props }">
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
                                :simple="true">
                            </PropertyPage>
                            <SecretPage :modelValue="model.secrets ?? []" :validate-manager="validateManager"
                                :simple="true">
                            </SecretPage>

                            <v-expansion-panels v-if="model.webhooks" class="elevation-3" :static="true">
                                <v-expansion-panel title="Webhooks">
                                    <v-expansion-panel-text>
                                        <v-row>
                                            <v-col v-for="webhook in model.webhooks" :key="webhook.name" cols="12"
                                                md="4">
                                                <WebhookPage :model="webhook"></WebhookPage>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>

                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="model.provider_project">
                <!-- TODO: show more detail info -->
                <v-card class="h-100 overflow-y-auto d-flex flex-column">
                    <template v-slot:title>
                        <v-sheet class="d-flex ga-3 align-center">
                            <p class="text-h5 font-weight-black">{{ model.provider_project.name }}</p>
                            <a :href="model.url" target="_blank" class="ga-6 py-1 px-2">
                                <v-hover>
                                    <template v-slot:default="{ props }">
                                        <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                                    </template>
                                </v-hover>
                            </a>
                        </v-sheet>
                    </template>
                    <template v-slot:append v-if="model.provider_project.environments">
                        <v-badge color="green" v-for="item in model.provider_project.environments" :key="item"
                            :content="item" inline></v-badge>
                    </template>
                    <v-card-text class="d-flex flex-column pa-3 ga-3 elevation-3">
                        <MarkdownBadge :badgeMarkdown="model.provider_project.badge_markdown ?? ''"
                            v-if="model.provider_project.badge_markdown">
                        </MarkdownBadge>

                        <v-sheet class="d-flex flex-column pa-3 ga-3 elevation-3">
                            <label class="v-label">Description</label>
                            <div class="text-medium-emphasis">{{ model.provider_project.description }}</div>
                        </v-sheet>

                        <PropertyPage :modelValue="model.provider_project.properties ?? []"
                            :validate-manager="validateManager" :simple="true">
                        </PropertyPage>

                        <v-expansion-panels class="elevation-3" :static="true">
                            <v-expansion-panel title="Environment Variables">
                                <v-expansion-panel-text>
                                    <v-table v-if="(model.provider_project.environment_variables ?? []).length > 0">
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Id
                                                </th>
                                                <th class="text-left">
                                                    Key
                                                </th>
                                                <th class="text-left">
                                                    Type
                                                </th>
                                                <th class="text-left">
                                                    Value
                                                </th>
                                                <th class="text-left">
                                                    Created At
                                                </th>
                                                <th class="text-left">
                                                    Updated At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in model.provider_project.environment_variables"
                                                :key="item.id">
                                                <td>{{ item.id }}</td>
                                                <td>{{ item.key }}</td>
                                                <td>{{ item.type }}</td>
                                                <td>{{ item.value }}</td>
                                                <td>{{ timeFormat(item.createdAt) }}</td>
                                                <td>{{ timeFormat(item.updatedAt) }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-expansion-panels class="elevation-3" :static="true">
                            <v-expansion-panel title="Webhooks">
                                <v-expansion-panel-text v-if="model.provider_project.webhooks">
                                    <v-row>
                                        <v-col v-for="webhook in model.provider_project.webhooks" :key="webhook.name"
                                            cols="12" md="4">
                                            <WebhookPage :model="webhook"></WebhookPage>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-expansion-panels class="elevation-3" :static="true">
                            <v-expansion-panel title="Workflow Runs">
                                <v-expansion-panel-text>
                                    <v-timeline v-if="model.provider_project.workflow_runs">
                                        <v-timeline-item
                                            v-for="(workflowRun, i) in model.provider_project.workflow_runs" :key="i"
                                            dot-color="indigo-lighten-2" icon="md:schedule" fill-dot width="100%">
                                            <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                                                <v-card-title class="text-h6">
                                                    {{ timeFormat(workflowRun.createdAt) }}
                                                </v-card-title>
                                                <v-card-subtitle>
                                                    <span class="d-inline-block text-truncate"
                                                        style="max-width: 300px;">
                                                        {{ workflowRun.name }}
                                                    </span>
                                                </v-card-subtitle>

                                                <v-card-text class="d-flex flex-column ga-3 overflow-hidden">
                                                    <v-sheet>
                                                        {{ workflowRun.description }}
                                                    </v-sheet>

                                                    <v-divider></v-divider>

                                                    <MarkdownBadge :badgeMarkdown="workflowRun.badge_markdown ?? ''"
                                                        v-if="workflowRun.badge_markdown">
                                                    </MarkdownBadge>
                                                </v-card-text>
                                            </v-card>
                                        </v-timeline-item>
                                    </v-timeline>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-expansion-panels class="elevation-3" :static="true">
                            <v-expansion-panel title="Deployments">
                                <v-expansion-panel-text v-if="model.provider_project.deployments">
                                    <v-row>
                                        <v-col v-for="deployment in model.provider_project.deployments"
                                            :key="deployment.name" cols="12" md="4">
                                            <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                                                <template v-slot:title>
                                                    <span class="text-h6">
                                                        {{ timeFormat(deployment.createdAt) }}
                                                    </span>
                                                </template>
                                                <template v-slot:append>
                                                    <v-badge
                                                        :color="deployment.readyState == 'READY' ? 'green' : 'orange'"
                                                        :content="deployment.readyState" inline></v-badge>
                                                    <v-badge color="green" :content="deployment.readySubstate"
                                                        inline></v-badge>
                                                </template>
                                                <v-card-text class="d-flex flex-column ga-3 overflow-hidden">
                                                    <span class="d-inline-block text-truncate">
                                                        {{ deployment.name }}
                                                    </span>
                                                    <v-divider></v-divider>

                                                    <MarkdownBadge :badgeMarkdown="deployment.badge_markdown ?? ''"
                                                        v-if="deployment.badge_markdown">
                                                    </MarkdownBadge>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                    </v-card-text>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>
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
