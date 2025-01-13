<script lang="ts" setup>
import { ref, watch, onUnmounted, computed, watchEffect, toRef, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import Empty from '@/common/EmptyStates.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import WebhookPage from './Webhook.vue'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'

import {
    OperateEnum, PlatformApiFactory, UpdatePlatformProjectRequest,
    PlatformDetailView, PlatformProject, ProviderEnum, checkPlatfromProjectProperty,
    DefaultWebhook, DefaultPlatformProject
} from './platform'
import { ValidateManager } from '@/tools/validate'

interface PlatformProjectView extends PlatformProject {
    operate: OperateEnum
    markfollow?: string
}

const convertProject = (model: PlatformProject | undefined): PlatformProjectView => {
    if (model == undefined) {
        return {
            operate: OperateEnum.Upsert, ...DefaultPlatformProject
        }
    }

    model = _.cloneDeep(model)

    return { ...model, operate: OperateEnum.Upsert }
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

const isLoading = ref(false)
const editModel = ref<PlatformProjectView>(convertProject(props.model))

const dialog = ref(false)
const tab = ref("one")

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    var projectModel = editModel.value
    const providerProject = (props.projects ?? []).find(p => p.provider_project_id == projectModel.provider_project_id)
    if (providerProject) {
        const properties = _.unionBy(providerProject.properties, editModel.value.properties, "key")
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

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', dialog: PlatformProject): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

const deleteProject = async () => {
    if (props.platformId && editModel.value.id) {
        isLoading.value = true
        const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdDelete(props.platformId, editModel.value.id)
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
    if (editModel.value.webhooks != undefined && editModel.value.webhooks.findIndex(p => p.name == "") > -1) {
        return
    }

    let view = _.cloneDeep(editModel.value)
    if (view.webhooks == undefined) {
        view = { ...view, webhooks: [DefaultWebhook] }
    } else {
        view.webhooks.push(DefaultWebhook)
    }
    editModel.value = view
}

watch(() => props.model, (newVal) => {
    editModel.value = convertProject(newVal)
})

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

onUnmounted(() => {
    validateManager.clearInputs()
})

const followRef = toRef(props, 'follow')
onMounted(() => {
    if (followRef.value) {
        editModel.value.markfollow = Date.now().toString()
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

const logined = computed(() =>
    authService.isAuthenticated()
)

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Project Basic</v-tab>
            <v-tab value="two" v-if="editModel.id">Webhooks</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" v-if="!isLoading">
            <v-tabs-window-item value="one">

                <v-card class="h-100 overflow-y-auto">
                    <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
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
                                :rules="validateManager.requiredMinMax('Name', 3, 250)" label="Description"
                                :model-value="proxyModel.value.description" name="input-7-1" variant="filled"
                                :hideDetails="false" auto-grow />
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
                            <v-sheet class="d-flex justify-end ga-3" v-if="logined">
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

            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="editModel.id">
                <Empty v-if="editModel.webhooks == undefined || editModel.webhooks.length == 0">
                    <v-btn icon="md:add" size="x-large" @click="addNewWebhook" elevation="8" :disabled="disabled"></v-btn>
                </Empty>
                <v-row class="pa-3" v-else>
                    <v-col v-for="webhook in editModel.webhooks" :key="webhook.name" cols="12" md="4">
                        <WebhookPage :platform-id="platformId" :project-id="editModel.id" :model="webhook"
                            @cancel="webhookCreateCanceled" @save="webhookCreated"></WebhookPage>
                    </v-col>
                    <v-col cols="12" md="4" v-if="logined">
                        <v-btn icon="md:add" size="x-large" @click="addNewWebhook" :disabled="disabled"></v-btn>
                    </v-col>
                </v-row>
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
