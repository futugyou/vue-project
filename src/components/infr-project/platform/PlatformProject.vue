<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'

import { PlatformApiFactory, UpdatePlatformProjectRequest, } from './platform'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()

const props = defineProps({
    dialog: Boolean,
    platformId: String,
})

const dialog = ref(props.dialog)
const isLoading = ref(false)
const editModel = ref<PlatformProjectModel>({
    name: '',
    url: '',
    property: [],
})

export interface PlatformProjectModel {
    name: string
    property?: { key: string, value: string }[]
    url: string
}

const save = async () => {
    if (!editModel.value.name || !editModel.value.url || !props.platformId) {
        return
    }

    isLoading.value = true

    let arr = _.filter(editModel.value.property, (prop) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.value && prop.value.trim() !== ''
        return keyIsValid && valueIsValid
    }) as { key: string, value: string }[]

    const property = arr.reduce((acc: { [key: string]: string }, item: { key: string, value: string }) => {
        acc[item.key] = item.value
        return acc
    }, {})

    var body: UpdatePlatformProjectRequest = {
        name: editModel.value.name,
        url: editModel.value.url,
        property: property,
    }

    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectPost(body, props.platformId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }
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

const addProperty = (model: PlatformProjectModel) => {
    const request = _.cloneDeep(model)

    if (!request.property) {
        request.property = []
    }

    request.property.push({ key: '', value: '', })
    editModel.value = request
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save" v-if="!isLoading">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-text-field v-model="proxyModel.value.name" label="Name" />
                <v-text-field v-model="proxyModel.value.url" label="URL" />

                <v-row v-for="(property, index) in proxyModel.value.property" :key="index">
                    <v-col cols="6">
                        <v-text-field v-model="property.key" label="Key" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="property.value" label="Value" />
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
