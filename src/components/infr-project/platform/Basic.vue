<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'

import { PlatformApiFactory, PlatformDetailView, CreatePlatformRequest, UpdatePlatformRequest, PropertyInfo } from './platform'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const props = defineProps<{
    model?: PlatformDetailView,
}>()

const isLoading = ref(false)
const editModel = ref<PlatformDetailView>(props.model ?? {
    id: '',
    name: '',
    activate: true,
    is_deleted: false, // TODO, temporarily not processing deletion
    rest_endpoint: '',
    url: '',
    tags: [],
    property: [],
    projects: []
})

const save = async () => {
    if (!editModel.value.name || !editModel.value.rest_endpoint || !editModel.value.url) {
        return
    }

    isLoading.value = true
    let property = _.filter(editModel.value.property, (prop: PropertyInfo) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.value && prop.value.trim() !== ''
        return keyIsValid && valueIsValid
    }) as PropertyInfo[]

    let body: UpdatePlatformRequest | CreatePlatformRequest = {
        name: editModel.value.name,
        rest: editModel.value.rest_endpoint,
        url: editModel.value.url,
        activate: editModel.value.activate,
        tags: editModel.value.tags ?? [],
        property: property,
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
            errorMessages: [error.message],
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

const addProperty = (model: PlatformDetailView) => {
    const updatedPlatformDetailView = _.cloneDeep(model)

    if (!updatedPlatformDetailView.property) {
        updatedPlatformDetailView.property = []
    }

    updatedPlatformDetailView.property.push({ key: '', value: '', needMask: false })
    editModel.value = updatedPlatformDetailView
}

const removeProperty = (model: PlatformDetailView, index: number) => {
    const updatedPlatformDetailView = _.cloneDeep(model)
    if (!updatedPlatformDetailView.property) {
        updatedPlatformDetailView.property = []
    }

    editModel.value = { ...updatedPlatformDetailView, property: updatedPlatformDetailView.property.filter((_, i) => i !== index) }
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save" v-if="!isLoading">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-text-field v-model="proxyModel.value.id" label="ID" disabled v-if="proxyModel.value.id" />
                <v-text-field v-model="proxyModel.value.name" label="Name" />
                <v-text-field v-model="proxyModel.value.rest_endpoint" label="REST Endpoint" />
                <v-text-field v-model="proxyModel.value.url" label="URL" />
                <v-switch v-model="proxyModel.value.activate" label="Activate" class="pl-2" color="info" />
                <!-- <v-switch v-model="proxyModel.value.is_deleted" label="Is Deleted" /> -->
                <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple></v-combobox>

                <v-row v-for="(property, index) in proxyModel.value.property" :key="index">
                    <v-col cols="4">
                        <v-text-field v-model="property.key" label="Key" />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="property.value" :type="property.needMask ? 'password' : 'text'"
                            label="Value" />
                    </v-col>
                    <v-col cols="2">
                        <v-switch v-model="property.needMask" label="Mask" color="info" />
                    </v-col>
                    <v-col cols="2" class="d-flex align-center">
                        <v-btn icon @click="removeProperty(proxyModel.value, index)">
                            <v-icon icon="md:remove"></v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-btn color="primary" @click="addProperty(proxyModel.value)">Add Property</v-btn>

                <v-spacer></v-spacer>
                <v-sheet class="d-flex justify-end ga-3">
                    <component :is="actions"></component>
                </v-sheet>
            </template>
        </v-confirm-edit>
    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
