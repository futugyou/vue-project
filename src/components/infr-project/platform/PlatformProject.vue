<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'

import { PlatformApiFactory, UpdatePlatformProjectRequest, PlatformDetailView, fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck } from './platform'

export interface PlatformProjectModel {
    name: string
    property?: { key: string, value: string }[]
    url: string
}

const store = useMessageStore()
const { msg } = storeToRefs(store)

const props = defineProps<{
    platformId: string,
    projectId?: string,
    model?: PlatformProjectModel,
}>()

const isLoading = ref(false)
const editModel = ref<PlatformProjectModel>(props.model ?? {
    name: '',
    url: '',
    property: [],
})

const dialog = ref(false)

const rules = {
    Name: [(value: string) => fieldRequiredCheck(value, 'Name'), (value: string) => fieldMinLengthCheck(value, 'Name', 3), (value: string) => fieldMaxLengthCheck(value, 'Name', 50),],
    Url: [(value: string) => fieldRequiredCheck(value, 'Url'), (value: string) => fieldMinLengthCheck(value, 'Url', 3), (value: string) => fieldMaxLengthCheck(value, 'Url', 150),],
    PropertyKey: [(value: string) => fieldRequiredCheck(value, 'Property key'), (value: string) => fieldMinLengthCheck(value, 'Property key', 3)],
    PropertyValue: [(value: string) => fieldRequiredCheck(value, 'Property value'), (value: string) => fieldMinLengthCheck(value, 'Property value', 3)],
}

const inputRefs = ref<{ [key: string]: any }>({})

const setInputRef = (el: any, key: string) => {
    inputRefs.value[key] = el
}

const save = async () => {
    let validateMsg: string[] = []
    for (const key in inputRefs.value) {
        const input = inputRefs.value[key]
        if (input) {
            const message: string[] = await input.validate(true)
            if (message && message.length > 0) {
                validateMsg = [...validateMsg, ...message]
            }
        }
    }

    if (validateMsg.length > 0) {
        msg.value = {
            errorMessages: validateMsg,
            delay: 3000,
        }
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
    (e: 'update:model', dialog: PlatformProjectModel): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

const addProperty = (model: PlatformProjectModel) => {
    const view = _.cloneDeep(model)

    if (!view.property) {
        view.property = []
    }

    view.property.push({ key: '', value: '', })
    editModel.value = view
}

const removeProperty = (model: PlatformProjectModel, index: number) => {
    const view = _.cloneDeep(model)
    if (!view.property) {
        view.property = []
    }

    editModel.value = { ...view, property: view.property.filter((_, i) => i !== index) }
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

watch(() => props.model, (newVal) => {
    editModel.value = newVal ?? {
        name: '',
        url: '',
        property: [],
    }
})

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save" v-if="!isLoading">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-text-field :model-value="projectId" label="Id" disabled v-if="projectId" />
                <v-text-field :ref="el => setInputRef(el, 'name')" v-model="proxyModel.value.name" :rules="rules.Name"
                    label="Name" :hideDetails="false" />
                <v-text-field :ref="el => setInputRef(el, 'url')" v-model="proxyModel.value.url" :rules="rules.Url"
                    label="URL" :hideDetails="false" />

                <v-row v-for="(property, index) in proxyModel.value.property" :key="index">
                    <v-col cols="5">
                        <v-text-field :ref="el => setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                            :rules="rules.PropertyKey" :hideDetails="false" />
                    </v-col>
                    <v-col cols="5">
                        <v-text-field :ref="el => setInputRef(el, `p-value-${index}`)" v-model="property.value"
                            label="Value" :rules="rules.PropertyValue" :hideDetails="false" />
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
                    <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel" v-model:dialog="dialog"
                        @save="deleteProject" v-if="projectId">
                        <v-alert text="Are you sure you want to delete?"></v-alert>
                    </VuetifyModal>
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
}</style>
