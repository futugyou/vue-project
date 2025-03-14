<script lang="ts" setup>
import { ref, watch, onUnmounted, computed, watchEffect, toRef, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { unionBy, cloneDeep } from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import WebhookPage from './WebhookV2.vue'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'

import { OperateEnum, PlatformApiFactory, ProviderEnum, checkPlatfromProjectProperty } from './platform'
import type { UpdatePlatformProjectRequest, PlatformDetailView, PlatformProject, Property, Secret, Webhook} from './platform'
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
    import_webhooks: boolean;
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
            description: "",
            import_webhooks: false,
        }
    }

    var confirmEditModel = cloneDeep({
        operate: OperateEnum.Upsert,
        followed: model.followed,
        id: model.id,
        name: model.name,
        properties: model.properties,
        provider_project_id: model.provider_project_id,
        secrets: model.secrets,
        url: model.url,
        description: model.description,
        import_webhooks: model.webhooks?.length > 0,
    })

    return { ...confirmEditModel }
}

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()
const validateManager = ValidateManager()
const props = defineProps<{
    platformId: string,
    platformName: string,
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

const dialog = ref(false)

const save = async () => {
    if (!logined.value) {
        return
    }

    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    var projectModel = confirmEditModel.value
    const providerProject = (props.projects ?? []).filter(p => p.provider_project).find(p => p.provider_project!.id == projectModel.provider_project_id)
    if (providerProject) {
        const properties = unionBy(providerProject.properties, confirmEditModel.value.properties, "key")
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
        import_webhooks: projectModel.import_webhooks,
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

watch(() => props.model, (newVal) => {
    webhookDatas.value = newVal?.webhooks ?? []
    confirmEditModel.value = convertToConfirmEditModel(newVal)
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
    (props.projects ?? []).filter(p => p.provider_project).map((project) => ({
        label: project.provider_project!.name,
        value: project.provider_project!.id,
    }))
)

const disabled = computed(() => {
    if (props.disabled != undefined) {
        return props.disabled
    }
    return !authService.isAuthenticated()
})

const getDetailUrl = (platformName: string, projectId: string) => {
    return "/platform/" + platformName + "/" + projectId
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="h-100 overflow-y-auto" v-if="!isLoading && logined">
            <v-confirm-edit v-model="confirmEditModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :model-value="proxyModel.value.id" label="Id" disabled v-if="proxyModel.value.id"
                        :hideDetails="false">
                        <template v-slot:append>
                            <v-badge :color="proxyModel.value.followed ? 'green' : 'orange'"
                                :content="proxyModel.value.followed ? 'Followed' : 'Unfollowed'" inline></v-badge>
                        </template>
                    </v-text-field>

                    <v-text-field :ref="el => validateManager.setInputRef(el, 'name')" v-model="proxyModel.value.name"
                        :readonly="disabled" :rules="validateManager.requiredMinMax('Name', 3, 50)" label="Name"
                        :hideDetails="false">
                        <template v-slot:append v-if="proxyModel.value.followed">
                            <v-tooltip text="to go project detail page" location="start"
                                v-if="model && model.id && platformName">
                                <template v-slot:activator="{ props }">
                                    <a :href="getDetailUrl(platformName, model.id)" target="_blank">
                                        <v-icon icon="md:info" v-bind="props"></v-icon>
                                    </a>
                                </template>
                            </v-tooltip>
                        </template>
                    </v-text-field>
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'url')" v-model="proxyModel.value.url"
                        :readonly="disabled" :rules="validateManager.requiredMinMax('URL', 3, 150)" label="URL"
                        :hideDetails="false" />
                    <v-textarea :ref="el => validateManager.setInputRef(el, 'description')"
                        v-model="proxyModel.value.description" :readonly="disabled"
                        :rules="validateManager.requiredMinMax('Description', 3, 250)" label="Description"
                        :hideDetails="false" class="mb-3" />

                    <v-select v-model="proxyModel.value.provider_project_id" label="Provider Project"
                        :hideDetails="false" :readonly="disabled" :items="projectsOptions" item-value="value" clearable
                        item-title="label"></v-select>

                    <v-select :ref="el => validateManager.setInputRef(el, 'operate')" :readonly="disabled"
                        :rules="validateManager.required('operate')" v-model="proxyModel.value.operate" class="mb-5"
                        :items="operateOptions" label="Operate" item-value="value" item-title="label"></v-select>

                    <v-switch v-model="proxyModel.value.import_webhooks" color="secondary" class="pl-3 mb-3"
                        label="Auto Import Webhooks" :readonly="disabled"></v-switch>

                    <PropertyPage v-model="proxyModel.value.properties" :validate-manager="validateManager"
                        :readonly="disabled">
                    </PropertyPage>
                    <SecretPage v-model="proxyModel.value.secrets" :validate-manager="validateManager"
                        :readonly="disabled"></SecretPage>

                    <v-spacer></v-spacer>
                    <v-sheet class="d-flex justify-end ma-4 ga-3">
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

        <v-card class="h-100 overflow-y-auto" v-if="!isLoading && !logined && model">
            <template v-slot:title>
                <v-sheet class="d-flex ga-3 align-center">
                    <p class="text-h5 font-weight-black">{{ model.name }}</p>
                    <a :href="model.url" target="_blank">
                        <v-hover>
                            <template v-slot:default="{ props }">
                                <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                            </template>
                        </v-hover>
                    </a>
                    <v-spacer></v-spacer>
                    <v-tooltip text="togo project detail page" location="start" v-if="model && model.id && platformName">
                        <template v-slot:activator="{ props }">
                            <a :href="getDetailUrl(platformName, model.id)" target="_blank">
                                <v-icon icon="md:info" v-bind="props"></v-icon>
                            </a>
                        </template>
                    </v-tooltip>
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
                        :readonly="disabled">
                    </PropertyPage>
                    <SecretPage :modelValue="model.secrets ?? []" :validate-manager="validateManager"
                        :readonly="disabled">
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
