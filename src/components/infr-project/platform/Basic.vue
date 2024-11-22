<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onUnmounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useVaultStore } from '@/stores/vault'
import { useAuth } from '@/plugins/auth'

import {
    PlatformApiFactory, PlatformDetailView, CreatePlatformRequest, ProviderEnum,
    UpdatePlatformRequest, Property, Secret
} from './platform'

import { VaultApiFactory, VaultView } from '../vault/vault'

import { ValidateManager } from '@/tools/validate'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const vaultStore = useVaultStore()
const { vaultList } = storeToRefs(vaultStore)
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

const fetchVaultData = async () => {
    if (vaultList.value.length > 0) {
        return
    }
    const { data, error } = await VaultApiFactory().v1VaultGet()
    if (error) {
        vaultList.value = []
        return
    }

    vaultList.value = _.orderBy(data, "key", "desc")
}

watchEffect(async () => fetchVaultData())

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    isLoading.value = true
    let properties = _.filter(editModel.value.properties, (prop: Property) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.value && prop.value.trim() !== ''
        return keyIsValid && valueIsValid
    }) as Property[]

    let secrets = _.filter(editModel.value.secrets, (prop: Secret) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.vault_id && prop.vault_id.trim() !== ''
        return keyIsValid && valueIsValid
    }) as Secret[]

    const provider: unknown = editModel.value.provider ?? ""
    let body: UpdatePlatformRequest | CreatePlatformRequest = {
        name: editModel.value.name,
        url: editModel.value.url,
        activate: editModel.value.activate,
        tags: editModel.value.tags ?? [],
        properties: properties,
        provider: Object.values(ProviderEnum).includes(provider as ProviderEnum)
            ? (provider as ProviderEnum)
            : ProviderEnum.Other,
        secrets: secrets,
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

const addProperty = (model: Ref<PlatformDetailView>) => {
    const view = _.cloneDeep(model.value)

    if (!view.properties) {
        view.properties = []
    }

    view.properties.push({ key: '', value: '' })
    model.value = view
}

const addSecret = (model: Ref<PlatformDetailView>) => {
    const view = _.cloneDeep(model.value)

    if (!view.secrets) {
        view.secrets = []
    }

    view.secrets.push({ key: '', vault_id: '' })
    model.value = view
}

const removeProperty = (model: Ref<PlatformDetailView>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.properties) {
        view.properties = []
    }

    model.value = { ...view, properties: view.properties.filter((_, i) => i !== index) }
}

const removeSecret = (model: Ref<PlatformDetailView>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.secrets) {
        view.secrets = []
    }

    model.value = { ...view, secrets: view.secrets.filter((_, i) => i !== index) }
}

onUnmounted(() => {
    validateManager.clearInputs()
})

const providerOptions = computed(() =>
    Object.keys(ProviderEnum).map((key) => ({
        label: key,
        value: ProviderEnum[key as keyof typeof ProviderEnum],
    }))
)

const vaultOptions = computed(() =>
    vaultList.value.map((vault) => ({
        label: vault.key + " - " + vault.storage_media,
        value: vault.id,
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
                        :rules="validateManager.required('Provider')" v-model="proxyModel.value.provider" class="mb-5"
                        :items="providerOptions" label="Provider" item-value="value" item-title="label"></v-select>
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :disabled="!authService.isAuthenticated()" :hideDetails="false"></v-combobox>

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
                                :rules="validateManager.requiredMinMax('Property Value', 3, 150)" :hideDetails="false"
                                :disabled="!authService.isAuthenticated()" />
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
