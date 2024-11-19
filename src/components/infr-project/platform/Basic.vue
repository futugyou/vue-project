<script lang="ts" setup>
import { ref, watch, computed, onUnmounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    PlatformApiFactory, PlatformDetailView, CreatePlatformRequest, ProviderEnum,
    UpdatePlatformRequest, Property
} from './platform'

import { ValidateManager } from '@/tools/validate'

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
    is_deleted: false, // TODO, temporarily not processing deletion 
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

    isLoading.value = true
    let property = _.filter(editModel.value.properties, (prop: Property) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.value && prop.value.trim() !== ''
        return keyIsValid && valueIsValid
    }) as Property[]
    const provider: unknown = editModel.value.provider ?? ""
    let body: UpdatePlatformRequest | CreatePlatformRequest = {
        name: editModel.value.name,
        url: editModel.value.url,
        activate: editModel.value.activate,
        tags: editModel.value.tags ?? [],
        properties: property,
        provider: Object.values(ProviderEnum).includes(provider as ProviderEnum)
            ? (provider as ProviderEnum)
            : ProviderEnum.Other,
        secrets: [],// TODO
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

const removeProperty = (model: Ref<PlatformDetailView>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.properties) {
        view.properties = []
    }

    model.value = { ...view, properties: view.properties.filter((_, i) => i !== index) }
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

</script>

<template>
    <v-sheet>
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="pa-3" v-if="!isLoading">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
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
                    <!-- <v-switch v-model="proxyModel.value.is_deleted" label="Is Deleted" /> -->
                    <v-select :ref="el => validateManager.setInputRef(el, 'vault_type')"
                        :rules="validateManager.required('Provider')" v-model="proxyModel.value.provider" class="mb-5"
                        :items="providerOptions" label="Provider" item-value="value" item-title="label"></v-select>
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :disabled="!authService.isAuthenticated()" :hideDetails="false"></v-combobox>

                    <div>
                        <label class="v-label mt-3 pl-3">Properties</label>
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
                            <v-btn icon @click="removeProperty(proxyModel, index)">
                                <v-icon icon="md:remove"></v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-btn color="primary" @click="addProperty(proxyModel)" v-if="authService.isAuthenticated()">Add
                        Property</v-btn>

                    <v-spacer></v-spacer>
                    <v-sheet class="d-flex justify-end ga-3" v-if="authService.isAuthenticated()">
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
