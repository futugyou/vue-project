<script lang="ts" setup>
import { ref, watch, onUnmounted, computed, watchEffect, toRef, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import MarkdownBadge from '@/common/MarkdownBadge.vue'
import Empty from '@/common/EmptyStates.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import WebhookPage from './Webhook.vue'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'
import { timeFormat } from '@/tools/timeFormat'

import {
    OperateEnum, PlatformApiFactory, UpdatePlatformProjectRequest,
    PlatformDetailView, PlatformProject, PlatformProviderProject, ProviderEnum, checkPlatfromProjectProperty,
    DefaultWebhook, Property, Secret, Webhook
} from './platform'
import { ValidateManager } from '@/tools/validate'

interface ConfirmEditModel {
    operate: OperateEnum
    markfollow?: string
    followed: boolean;
    id: string;
    name: string;
    properties: Array<Property>;
    provider_project_id: string;
    secrets: Array<Secret>;
    url: string;
    description: string;
}

const convertToConfirmEditModel = (model: PlatformProject | undefined): ConfirmEditModel => {
    if (model == undefined) {
        return {
            operate: OperateEnum.Upsert,
            followed: false,
            id: "",
            name: "",
            properties: [],
            provider_project_id: "",
            secrets: [],
            url: "",
            description: ""
        }
    }

    var confirmEditModel = _.cloneDeep({
        operate: OperateEnum.Upsert,
        followed: model.followed,
        id: model.id,
        name: model.name,
        properties: model.properties,
        provider_project_id: model.provider_project_id,
        secrets: model.secrets,
        url: model.url,
        description: model.description
    })

    return { ...confirmEditModel }
}

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()
const validateManager = ValidateManager()
const props = defineProps<{
    platformId: string,
    provider: string,
    model?: PlatformProject,
    projects?: PlatformProject[],
    disabled?: boolean,
    follow?: boolean,
}>()

const logined = computed(() =>
    authService.isAuthenticated()
)

const isLoading = ref(false)
const webhookDatas = ref<Webhook[]>(props.model?.webhooks ?? [])
const confirmEditModel = ref<ConfirmEditModel>(convertToConfirmEditModel(props.model))
const platformProjectDetail = ref<PlatformProviderProject>()

const dialog = ref(false)
const tab = ref("one")

const save = async () => {
    if (!logined.value) {
        return
    }

    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    var projectModel = confirmEditModel.value
    const providerProject = (props.projects ?? []).find(p => p.provider_project_id == projectModel.provider_project_id)
    if (providerProject) {
        const properties = _.unionBy(providerProject.properties, confirmEditModel.value.properties, "key")
        projectModel.properties = properties
    }

    const provider: unknown = props.provider
    const providerEnum = Object.values(ProviderEnum).includes(provider as ProviderEnum)
        ? (provider as ProviderEnum)
        : ProviderEnum.Other
    const checkMsg = checkPlatfromProjectProperty(providerEnum, projectModel.properties)
    if (checkMsg) {
        msg.value = {
            errorMessages: [checkMsg],
            delay: 3000,
        }
        return
    }

    isLoading.value = true

    var body: UpdatePlatformProjectRequest = {
        name: projectModel.name,
        url: projectModel.url,
        properties: projectModel.properties,
        operate: projectModel.operate,
        provider_project_id: projectModel.provider_project_id,
        secrets: projectModel.secrets,
        description: projectModel.description,
    }

    let response
    if (projectModel.id) {
        response = await PlatformApiFactory().v1PlatformIdProjectProjectIdPut(body, props.platformId, projectModel.id)
    } else {
        response = await PlatformApiFactory().v1PlatformIdProjectPost(body, props.platformId)
    }

    const { data, error } = response
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    if (data) {
        emit('save', data)
    }
}

const loadDetail = async () => {
    if (isLoading.value || props.model == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v2PlatformIdProjectProjectIdGet(props.platformId, props.model.id)
    isLoading.value = false
    if (error) {
        platformProjectDetail.value = undefined
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    if (data && data.provider_project) {
        platformProjectDetail.value = data.provider_project
    }
}

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', dialog: PlatformProject): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

const deleteProject = async () => {
    if (!logined.value) {
        return
    }

    if (props.platformId && confirmEditModel.value.id) {
        isLoading.value = true
        const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdDelete(props.platformId, confirmEditModel.value.id)
        isLoading.value = false
        if (error) {
            msg.value = {
                errorMessages: [error.message],
                delay: 3000,
            }

            return
        }

        if (data) {
            emit('save', data)
        }
    }
}

const webhookCreated = (model: PlatformDetailView) => {
    emit('save', model)
}

const webhookCreateCanceled = () => {
    emit('cancel')
}

const addNewWebhook = () => {
    let view = webhookDatas.value
    view.push(DefaultWebhook)
    webhookDatas.value = view
}

watch(() => props.model, (newVal) => {
    tab.value = "one"
    webhookDatas.value = props.model?.webhooks ?? []
    confirmEditModel.value = convertToConfirmEditModel(props.model)
})

watch(() => tab.value, async (newVal) => {
    if (newVal == "three") {
        await loadDetail()
    }
})


onUnmounted(() => {
    validateManager.clearInputs()
})

const followRef = toRef(props, 'follow')
onMounted(() => {
    if (followRef.value) {
        confirmEditModel.value.markfollow = Date.now().toString()
    }
})

const operateOptions = computed(() =>
    Object.keys(OperateEnum).map((key) => ({
        label: key,
        value: OperateEnum[key as keyof typeof OperateEnum],
    }))
)

const projectsOptions = computed(() =>
    (props.projects ?? []).map((project) => ({
        label: project.name,
        value: project.provider_project_id,
    }))
)

const disabled = computed(() => {
    if (props.disabled != undefined) {
        return props.disabled
    }
    return !authService.isAuthenticated()
})

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Project Basic</v-tab>
            <v-tab value="two" v-if="confirmEditModel.id">Webhooks</v-tab>
            <v-tab value="three" v-if="confirmEditModel.id">Details</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" v-if="!isLoading">
            <v-tabs-window-item value="one">
                <v-card class="h-100 overflow-y-auto" v-if="logined">
                    <v-confirm-edit v-model="confirmEditModel" @cancel="cancel" @save="save">
                        <template v-slot:default="{ model: proxyModel, actions }">
                            <v-text-field :model-value="proxyModel.value.id" label="Id" disabled v-if="proxyModel.value.id"
                                :hideDetails="false">
                                <template v-slot:append>
                                    <v-badge :color="proxyModel.value.followed ? 'green' : 'orange'"
                                        :content="proxyModel.value.followed ? 'Followed' : 'Unfollowed'" inline></v-badge>
                                </template>
                            </v-text-field>

                            <v-text-field :ref="el => validateManager.setInputRef(el, 'name')"
                                v-model="proxyModel.value.name" :disabled="disabled"
                                :rules="validateManager.requiredMinMax('Name', 3, 50)" label="Name" :hideDetails="false" />
                            <v-text-field :ref="el => validateManager.setInputRef(el, 'url')" v-model="proxyModel.value.url"
                                :disabled="disabled" :rules="validateManager.requiredMinMax('URL', 3, 150)" label="URL"
                                :hideDetails="false" />
                            <v-textarea :ref="el => validateManager.setInputRef(el, 'description')"
                                v-model="proxyModel.value.description" :disabled="disabled"
                                :rules="validateManager.requiredMinMax('Description', 3, 250)" label="Description"
                                :hideDetails="false" class="mb-3" />
                            <v-select :ref="el => validateManager.setInputRef(el, 'operate')" :disabled="disabled"
                                :rules="validateManager.required('operate')" v-model="proxyModel.value.operate" class="mb-5"
                                :items="operateOptions" label="Operate" item-value="value" item-title="label"></v-select>

                            <v-select v-model="proxyModel.value.provider_project_id" label="Provider Project"
                                :hideDetails="false" :disabled="disabled" :items="projectsOptions" item-value="value"
                                clearable item-title="label"></v-select>

                            <PropertyPage v-model="proxyModel.value.properties" :validate-manager="validateManager"
                                :disabled="disabled">
                            </PropertyPage>
                            <SecretPage v-model="proxyModel.value.secrets" :validate-manager="validateManager"
                                :disabled="disabled"></SecretPage>

                            <v-spacer></v-spacer>
                            <v-sheet class="d-flex justify-end ga-3">
                                <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel"
                                    v-model:dialog="dialog" @save="deleteProject"
                                    v-if="proxyModel.value.id && followRef == undefined" :disabled="disabled">
                                    <v-alert text="Are you sure you want to delete?"></v-alert>
                                </VuetifyModal>
                                <component :is="actions" :disabled="disabled"></component>
                            </v-sheet>
                        </template>
                    </v-confirm-edit>
                </v-card>

                <v-card class="h-100 overflow-y-auto" v-if="!logined">
                    <template v-slot:title>
                        <p class="text-h4 font-weight-black">{{ model?.name }}</p>
                    </template>
                    <template v-slot:subtitle>
                        <v-sheet class="d-flex align-center">
                            <a :href="confirmEditModel.url" target="_blank" class="ga-6 py-1 px-2">
                                <v-hover>
                                    <template v-slot:default="{ props }">
                                        {{ model?.url }}
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
                    <template v-slot:text>
                        <v-sheet class="d-flex flex-column ga-3">
                            <div class="text-medium-emphasis" v-if="model?.description">
                                {{ model?.description }}
                            </div>

                            <MarkdownBadge :badgeMarkdown="model?.badge_markdown ?? ''" v-if="model?.badge_markdown">
                            </MarkdownBadge>

                            <PropertyPage :modelValue="model?.properties ?? []" :validate-manager="validateManager"
                                :disabled="disabled">
                            </PropertyPage>
                            <SecretPage :modelValue="model?.secrets ?? []" :validate-manager="validateManager"
                                :disabled="disabled">
                            </SecretPage>
                        </v-sheet>
                    </template>
                </v-card>

            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="confirmEditModel.id">
                <Empty v-if="webhookDatas.length == 0">
                    <v-btn icon="md:add" size="x-large" @click="addNewWebhook" elevation="8" :disabled="disabled"></v-btn>
                </Empty>
                <v-row class="pa-3" v-else>
                    <v-col v-for="webhook in webhookDatas" :key="webhook.name" cols="12" md="4">
                        <WebhookPage :platform-id="platformId" :project-id="confirmEditModel.id" :model="webhook"
                            @cancel="webhookCreateCanceled" @save="webhookCreated"></WebhookPage>
                    </v-col>
                    <v-col cols="12" md="4" v-if="logined">
                        <v-btn icon="md:add" size="x-large" @click="addNewWebhook" :disabled="disabled"></v-btn>
                    </v-col>
                </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="three" v-if="platformProjectDetail">
                <!-- TODO: show more detail info -->
                <v-card class="h-100 overflow-y-auto">
                    <template v-slot:title>
                        <p class="text-h4 font-weight-black">{{ platformProjectDetail.name }}</p>
                    </template>
                    <template v-slot:subtitle>
                        <v-sheet class="d-flex align-center">
                            <a :href="platformProjectDetail.url" target="_blank" class="ga-6 py-1 px-2">
                                <v-hover>
                                    <template v-slot:default="{ props }">
                                        {{ platformProjectDetail.url }}
                                        <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                                    </template>
                                </v-hover>
                            </a>
                        </v-sheet>
                    </template>
                    <template v-slot:text>
                        <v-sheet class="d-flex flex-column ga-3">
                            <div class="text-medium-emphasis" v-if="platformProjectDetail.description">
                                {{ platformProjectDetail.description }}
                            </div>
                        </v-sheet>

                        <v-timeline v-if="platformProjectDetail.workflow_runs" align="center" justify="center">
                            <v-timeline-item v-for="(workflowRun, i) in platformProjectDetail.workflow_runs" :key="i"
                                dot-color="indigo-lighten-2" icon="md:schedule">
                                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                                    <template v-slot:title> {{ timeFormat(workflowRun.createdAt) }} </template>

                                    <template v-slot:subtitle> {{ workflowRun.name }} </template>

                                    <v-card-text class="d-flex flex-column ga-3 text-truncate">
                                        <v-sheet class="d-flex flex-wrap ga-2">
                                            <v-chip>
                                                <strong>{{ workflowRun.status }}</strong>&nbsp;
                                            </v-chip>
                                        </v-sheet>

                                        <v-divider></v-divider>

                                        <MarkdownBadge :badgeMarkdown="workflowRun.badge_markdown ?? ''"
                                            v-if="workflowRun.badge_markdown">
                                        </MarkdownBadge>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                        </v-timeline>

                    </template>
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
