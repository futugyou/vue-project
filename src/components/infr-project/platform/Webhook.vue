<script lang="ts" setup>
import { ref, watch, computed, onUnmounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import { PlatformApiFactory, UpdatePlatformWebhookRequest, Webhook, DefaultWebhook, WebhookStateEnum, PlatformDetailView } from './platform'

import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'

import { ValidateManager } from '@/tools/validate'

export interface WebhookModel extends Webhook {
    sync: boolean
}

const convertWebhook = (mode: Webhook | undefined): WebhookModel => {
    if (mode == undefined) {
        return { sync: false, ...DefaultWebhook }
    }

    return {
        ..._.cloneDeep(mode),
        sync: false,
    }
}

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()
const validateManager = ValidateManager()

const props = defineProps<{
    model?: Webhook,
    platformId: string,
    projectId: string,
}>()

const isLoading = ref(false)
const dialog = ref(false)
const editModel = ref<WebhookModel>(convertWebhook(props.model))

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    isLoading.value = true

    const state: unknown = editModel.value.state ?? ""
    let body: UpdatePlatformWebhookRequest = {
        name: editModel.value.name ?? "",
        url: editModel.value.url ?? "",
        activate: editModel.value.activate ?? true,
        properties: editModel.value.properties,
        secrets: editModel.value.secrets,
        sync: editModel.value.sync,
        state: Object.values(WebhookStateEnum).includes(state as WebhookStateEnum)
            ? (state as WebhookStateEnum)
            : WebhookStateEnum.Init,
    }

    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdHookPut(body, props.platformId, props.projectId)

    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    emit('save', data!)
}

const deleteWebhook = async () => {
    const hook_name = editModel.value.name.trim()
    if (hook_name.length == 0) {
        return
    }

    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdHookDelete(props.platformId, props.projectId, hook_name)
    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    emit('save', data!)
}

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', model: Webhook): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

watch(() => props.model, (newVal) => {
    editModel.value = convertWebhook(newVal)
})

onUnmounted(() => {
    validateManager.clearInputs()
})

</script>

<template>
    <v-sheet>
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="pa-3" v-if="!isLoading">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'name')" v-model="proxyModel.value.name"
                        label="Name" :readonly="!authService.isAuthenticated()"
                        :rules="validateManager.requiredMinMax('Name', 3, 50)" :hideDetails="false" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'url')" v-model="proxyModel.value.url"
                        label="URL" :readonly="!authService.isAuthenticated()"
                        :rules="validateManager.requiredMinMax('URL', 3, 150)" :hideDetails="false" />
                    <v-select label="State" v-model="proxyModel.value.state"
                        :ref="el => validateManager.setInputRef(el, 'state')" :items="['Init', 'Creating', 'Ready']"
                        :hideDetails="false" class="mt-2"></v-select>
                    <v-switch v-model="proxyModel.value.sync" label="Force Sync" class="pl-2" color="info"
                        :hideDetails="false" :readonly="!authService.isAuthenticated()" />
                    <v-switch v-model="proxyModel.value.activate" label="Activate" class="pl-2" color="info"
                        :hideDetails="false" :readonly="!authService.isAuthenticated()" />

                    <PropertyPage v-model="proxyModel.value.properties" :validate-manager="validateManager">
                    </PropertyPage>
                    <SecretPage v-model="proxyModel.value.secrets" :validate-manager="validateManager"></SecretPage>

                    <v-spacer></v-spacer>
                    <v-sheet class="d-flex justify-end ga-3" v-if="authService.isAuthenticated()">
                        <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel"
                            v-model:dialog="dialog" @save="deleteWebhook">
                            <v-alert text="Are you sure you want to delete?"></v-alert>
                        </VuetifyModal>
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>

    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
