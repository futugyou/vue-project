<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onUnmounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    PlatformApiFactory, PlatformDetailView, CreatePlatformRequest, ProviderEnum,
    UpdatePlatformRequest, checkPlatfromPropertySecret
} from './platform'

import { ValidateManager } from '@/tools/validate'
import PropertyPage from './Property.vue'
import SecretPage from './Secret.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()
const validateManager = ValidateManager()

const props = defineProps<{
    model?: PlatformDetailView,
}>()

const isLoading = ref(false)
const editModel = ref<PlatformDetailView>(props.model ?? {
    id: '',
    name: '',
    activate: true,
    is_deleted: false,
    url: '',
    tags: [],
    properties: [],
    projects: [],
    secrets: [],
    provider: "other",
})

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }
    const provider: unknown = editModel.value.provider ?? ""
    const providerEnum = Object.values(ProviderEnum).includes(provider as ProviderEnum)
        ? (provider as ProviderEnum)
        : ProviderEnum.Other
    const checkMsg = checkPlatfromPropertySecret(providerEnum, editModel.value.properties, editModel.value.secrets)
    if (checkMsg) {
        msg.value = {
            errorMessages: [checkMsg],
            delay: 3000,
        }
        return
    }

    isLoading.value = true
    let body: UpdatePlatformRequest | CreatePlatformRequest = {
        name: editModel.value.name,
        url: editModel.value.url,
        activate: editModel.value.activate,
        tags: editModel.value.tags ?? [],
        properties: editModel.value.properties,
        provider: providerEnum,
        secrets: editModel.value.secrets,
    }

    let response
    if (editModel.value.id) {
        response = await PlatformApiFactory().v1PlatformIdPut(body as UpdatePlatformRequest, editModel.value.id)
    } else {
        response = await PlatformApiFactory().v1PlatformPost(body as CreatePlatformRequest)
    }

    const { data, error } = response
    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message ?? error],
            delay: 3000,
        }
        return
    }

    editModel.value = data!
    emit('save', editModel.value)
}

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', model: PlatformDetailView): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

onUnmounted(() => {
    validateManager.clearInputs()
})

const providerOptions = computed(() =>
    Object.keys(ProviderEnum).map((key) => ({
        label: key,
        value: ProviderEnum[key as keyof typeof ProviderEnum],
    }))
)

const deletePlatform = async (id: string) => {
    const answer = window.confirm('Do you really want to set the state to Deleting?')
    if (answer) {
        isLoading.value = true
        const { data, error } = await PlatformApiFactory().v1PlatformIdDelete(id)
        isLoading.value = false
        if (error) {
            msg.value = {
                errorMessages: [error.message ?? error],
                delay: 3000,
            }
            return
        }

        editModel.value = data!
    }
}

</script>

<template>
    <v-sheet>
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="pa-3" v-if="!isLoading">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions, isPristine }">
                    <v-text-field v-model="proxyModel.value.id" label="ID" disabled v-if="proxyModel.value.id"
                        :hideDetails="false" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'name')" v-model="proxyModel.value.name"
                        label="Name" :disabled="!authService.isAuthenticated()"
                        :rules="validateManager.requiredMinMax('Name', 3, 50)" :hideDetails="false" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'url')" v-model="proxyModel.value.url"
                        label="URL" :disabled="!authService.isAuthenticated()"
                        :rules="validateManager.requiredMinMax('URL', 3, 150)" :hideDetails="false" />
                    <v-switch v-model="proxyModel.value.activate" label="Activate" class="pl-2" color="info"
                        :disabled="!authService.isAuthenticated()" :hideDetails="false" />
                    <v-select :ref="el => validateManager.setInputRef(el, 'provider')"
                        :disabled="!authService.isAuthenticated()" :rules="validateManager.required('Provider')"
                        v-model="proxyModel.value.provider" class="mb-5" :items="providerOptions" label="Provider"
                        item-value="value" item-title="label"></v-select>
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :disabled="!authService.isAuthenticated()" :hideDetails="false"></v-combobox>

                    <PropertyPage :model="proxyModel.value.properties" :validate-manager="validateManager"></PropertyPage>
                    <SecretPage :model="proxyModel.value.secrets" :validate-manager="validateManager"></SecretPage>

                    <v-spacer></v-spacer>
                    <v-sheet class="d-flex justify-end ga-3" v-if="authService.isAuthenticated()">
                        <v-btn variant="elevated" v-if="proxyModel.value.id && !proxyModel.value.is_deleted"
                            @click="deletePlatform(proxyModel.value.id)">Delete</v-btn>
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
