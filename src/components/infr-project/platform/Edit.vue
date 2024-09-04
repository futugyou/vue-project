<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { timeFormat } from '@/tools/timeFormat'
import { useMessageStore } from '@/stores/message'

import { PlatformApiFactory, PlatformDetailView, CreatePlatformRequest, PropertyInfo } from './platform'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()

const props = defineProps({
    dialog: Boolean,
})

const dialog = ref(props.dialog)
const isLoading = ref(false)
const editModel = ref<PlatformDetailView>({
    id: '',
    name: '',
    activate: true,
    is_deleted: false,
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
    var body: CreatePlatformRequest = {
        name: editModel.value.name,
        rest: editModel.value.rest_endpoint,
        url: editModel.value.url,
        tags: editModel.value.tags ?? [],
        property: property,
    }
    const { data, error } = await PlatformApiFactory().v1PlatformPost(body)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }
    editModel.value = data!
}

const cancel = () => {
    dialog.value = false
}

const emit = defineEmits<{
    (e: 'update:dialog', dialog: boolean): void
}>()

watch(dialog, (newVal) => {
    emit('update:dialog', newVal)
})

const addProperty = () => {
    const updatedPlatformDetailView = _.cloneDeep(editModel.value)

    if (!updatedPlatformDetailView.property) {
        updatedPlatformDetailView.property = []
    }

    updatedPlatformDetailView.property.push({ key: '', value: '', needMask: false })
    editModel.value = updatedPlatformDetailView
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save" v-if="!isLoading">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-text-field v-model="proxyModel.value.id" label="ID" />
                <v-text-field v-model="proxyModel.value.name" label="Name" />
                <v-text-field v-model="proxyModel.value.rest_endpoint" label="REST Endpoint" />
                <v-text-field v-model="proxyModel.value.url" label="URL" />
                <v-switch v-model="proxyModel.value.activate" label="Activate" />
                <v-switch v-model="proxyModel.value.is_deleted" label="Is Deleted" />
                <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple></v-combobox>

                <v-row v-for="(property, index) in proxyModel.value.property" :key="index">
                    <v-col cols="5">
                        <v-text-field v-model="property.key" label="Key" />
                    </v-col>
                    <v-col cols="5">
                        <v-text-field v-model="property.value" :type="property.needMask ? 'password' : 'text'"
                            label="Value" />
                    </v-col>
                    <v-col cols="2">
                        <v-switch v-model="property.needMask" label="Mask" />
                    </v-col>
                </v-row>

                <v-btn color="primary" @click="addProperty">Add Property</v-btn>

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
