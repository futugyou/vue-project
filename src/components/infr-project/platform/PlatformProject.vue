<script lang="ts" setup>
import { ref, Ref, watch, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import Empty from '@/common/EmptyStates.vue'
import { useMessageStore } from '@/stores/message'
import { useVaultStore } from '@/stores/vault'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import WebhookPage from './Webhook.vue'

import {
    OperateEnum, PlatformApiFactory, UpdatePlatformProjectRequest,
    PlatformDetailView, PlatformProject, Secret, Property
} from './platform'
import { ValidateManager } from '@/tools/validate'

interface PlatformProjectView extends PlatformProject {
    operate: OperateEnum
}

const convertProject = (model: PlatformProject | undefined): PlatformProjectView => {
    if (model == undefined) {
        return {
            id: "", operate: OperateEnum.Upsert,
            name: "", url: "", followed: false, properties: [], provider_project_id: "", secrets: [], webhooks: []
        }
    }

    model = _.cloneDeep(model)

    return { ...model, operate: OperateEnum.Upsert }
}

const store = useMessageStore()
const { msg } = storeToRefs(store)
const vaultStore = useVaultStore()
const { vaultList } = storeToRefs(vaultStore)

const authService = useAuth()
const logined = authService.isAuthenticated()
const validateManager = ValidateManager()
const props = defineProps<{
    platformId: string,
    projectId?: string,
    model?: PlatformProject,
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

    isLoading.value = true

    var body: UpdatePlatformProjectRequest = {
        name: editModel.value.name,
        url: editModel.value.url,
        properties: editModel.value.properties,
        operate: editModel.value.operate,
        provider_project_id: editModel.value.provider_project_id,
        secrets: editModel.value.secrets,
    }

    let response
    if (props.projectId) {
        response = await PlatformApiFactory().v1PlatformIdProjectProjectIdPut(body, props.platformId, props.projectId)
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

const addProperty = (model: Ref<PlatformProject>) => {
    const view = _.cloneDeep(model.value)

    if (!view.properties) {
        view.properties = []
    }

    view.properties.push({ key: '', value: '' })
    model.value = view
}

const removeProperty = (model: Ref<PlatformProject>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.properties) {
        view.properties = []
    }

    model.value = { ...view, properties: view.properties.filter((_, i) => i !== index) }
}

const addSecret = (model: Ref<PlatformProject>) => {
    const view = _.cloneDeep(model.value)

    if (!view.secrets) {
        view.secrets = []
    }

    view.secrets.push({ key: '', vault_id: '' })
    model.value = view
}

const removeSecret = (model: Ref<PlatformProject>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.secrets) {
        view.secrets = []
    }

    model.value = { ...view, secrets: view.secrets.filter((_, i) => i !== index) }
}

const deleteProject = async () => {
    if (props.platformId && props.projectId) {
        isLoading.value = true
        const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdDelete(props.platformId, props.projectId)
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
        view = { ...view, webhooks: [{ name: "", url: "", properties: [], activate: true, state: 'Init', secrets: [] }] }
    } else {
        view.webhooks.push({ name: "", url: "", properties: [], activate: true, state: 'Init', secrets: [] })
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

const vaultOptions = computed(() =>
    vaultList.value.map((vault) => ({
        label: vault.key + " - " + vault.storage_media,
        value: vault.id,
    }))
)

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

        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Project Basic</v-tab>
            <v-tab value="two" v-if="projectId">Webhooks</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" v-if="!isLoading">
            <v-tabs-window-item value="one">

                <v-card class="h-100">
                    <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                        <template v-slot:default="{ model: proxyModel, actions }">
                            <v-text-field :model-value="projectId" label="Id" disabled v-if="projectId"
                                :hideDetails="false" />
                            <v-text-field :model-value="proxyModel.value.provider_project_id" label="Provider ProjectID"
                                disabled v-if="proxyModel.value.provider_project_id" :hideDetails="false" />
                            <v-switch v-model="proxyModel.value.followed" label="Followed" class="pl-2" color="info"
                                disabled :hideDetails="false" />

                            <v-text-field :ref="el => validateManager.setInputRef(el, 'name')"
                                v-model="proxyModel.value.name" :disabled="!logined"
                                :rules="validateManager.requiredMinMax('Name', 3, 50)" label="Name" :hideDetails="false" />
                            <v-text-field :ref="el => validateManager.setInputRef(el, 'url')" v-model="proxyModel.value.url"
                                :disabled="!logined" :rules="validateManager.requiredMinMax('URL', 3, 150)" label="URL"
                                :hideDetails="false" />
                            <v-select :ref="el => validateManager.setInputRef(el, 'operate')"
                                :rules="validateManager.required('operate')" v-model="proxyModel.value.operate" class="mb-5"
                                :items="operateOptions" label="Operate" item-value="value" item-title="label"></v-select>

                            <div class="d-flex align-center ga-6">
                                <label class="v-label pl-3">Properties</label>
                                <v-btn @click="addProperty(proxyModel)" variant="text" v-if="authService.isAuthenticated()"
                                    icon="md:add"></v-btn>
                            </div>

                            <v-row v-for="(property, index) in proxyModel.value.properties" :key="index" class="mt-2">
                                <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                                    <v-text-field :ref="el => validateManager.setInputRef(el, `p-key-${index}`)"
                                        v-model="property.key" label="Key"
                                        :rules="validateManager.requiredMinMax('Property Key', 3, 150)" :hideDetails="false"
                                        :disabled="!authService.isAuthenticated()" />
                                </v-col>
                                <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                                    <v-text-field :ref="el => validateManager.setInputRef(el, `p-value-${index}`)"
                                        v-model="property.value" label="Value"
                                        :rules="validateManager.requiredMinMax('Property Value', 3, 150)"
                                        :hideDetails="false" :disabled="!authService.isAuthenticated()" />
                                </v-col>
                                <v-col cols="2" class="pt-4" v-if="authService.isAuthenticated()">
                                    <v-btn icon="md:remove" @click="removeProperty(proxyModel, index)"></v-btn>
                                </v-col>
                            </v-row>

                            <div class="d-flex align-center ga-6">
                                <label class="v-label pl-3">Secrets</label>
                                <v-btn @click="addSecret(proxyModel)" variant="text" v-if="authService.isAuthenticated()"
                                    icon="md:add"></v-btn>
                            </div>

                            <v-row v-for="(secret, index) in proxyModel.value.secrets" :key="index" class="mt-2">
                                <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                                    <v-text-field :ref="el => validateManager.setInputRef(el, `s-key-${index}`)"
                                        v-model="secret.key" label="Key"
                                        :rules="validateManager.requiredMinMax('Secret Key', 3, 150)" :hideDetails="false"
                                        :disabled="!authService.isAuthenticated()" />
                                </v-col>
                                <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                                    <v-select :ref="el => validateManager.setInputRef(el, `s-value-${index}`)"
                                        v-model="secret.vault_id" label="Value"
                                        :rules="validateManager.requiredMinMax('Secret Value', 3, 150)" :hideDetails="false"
                                        :disabled="!authService.isAuthenticated()" class="mb-5" :items="vaultOptions"
                                        item-value="value" item-title="label"></v-select>
                                </v-col>
                                <v-col cols="2" class="pt-4" v-if="authService.isAuthenticated()">
                                    <v-btn icon="md:remove" @click="removeSecret(proxyModel, index)"></v-btn>
                                </v-col>
                            </v-row>

                            <v-spacer></v-spacer>
                            <v-sheet class="d-flex justify-end ga-3" v-if="logined">
                                <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel"
                                    v-model:dialog="dialog" @save="deleteProject" v-if="projectId">
                                    <v-alert text="Are you sure you want to delete?"></v-alert>
                                </VuetifyModal>
                                <component :is="actions"></component>
                            </v-sheet>
                        </template>
                    </v-confirm-edit>
                </v-card>

            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="projectId">
                <Empty v-if="editModel.webhooks == undefined || editModel.webhooks.length == 0">
                    <v-btn icon="md:add" size="x-large" @click="addNewWebhook" elevation="8" v-if="logined"></v-btn>
                </Empty>
                <v-row class="pa-3" v-else>
                    <v-col v-for="webhook in editModel.webhooks" :key="webhook.name" cols="12" md="4">
                        <WebhookPage :platform-id="platformId" :project-id="projectId" :model="webhook"
                            @cancel="webhookCreateCanceled" @save="webhookCreated"></WebhookPage>
                    </v-col>
                    <v-col cols="12" md="4" v-if="logined">
                        <v-btn icon="md:add" size="x-large" @click="addNewWebhook"></v-btn>
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
