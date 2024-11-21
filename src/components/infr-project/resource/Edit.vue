<script lang="ts" setup>
import { ref, watchEffect, computed, onUnmounted } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    ResourceApiFactory, CreateResourceRequest, ResourceViewDetail, ResourceTypeEnum
} from './resource'

import { ValidateManager } from '@/tools/validate'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()

const route = useRoute()
const validateManager = ValidateManager()
const isLoading = ref(false)

const resourceId = (route.query.id ?? "") as string

interface ResourceEditModel {
    id: string
    name: string
    type: string
    data: string
    tags: Array<string>
}

const DefaultResourceEditModel: ResourceEditModel = {
    id: resourceId,
    name: "",
    type: "Markdown",
    data: "",
    tags: []
}

const editModel = ref<ResourceEditModel>(DefaultResourceEditModel)

const cancel = () => {
    emit('cancel')
}

const fetchData = async () => {
    if (resourceId.length == 0) {
        return
    }

    isLoading.value = true
    const { data, error } = await ResourceApiFactory().v1ResourceIdGet(editModel.value.id)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    if (data) {
        editModel.value = {
            id: data.id,
            name: data.name,
            type: data.type,
            data: data.data,
            tags: data.tags,
        }
    }

}
fetchData()

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    isLoading.value = true

    isLoading.value = false

}

const emit = defineEmits<{
    (e: 'cancel'): void
}>()


const resourceTypeOptions = computed(() =>
    Object.keys(ResourceTypeEnum).map((key) => ({
        label: key,
        value: ResourceTypeEnum[key as keyof typeof ResourceTypeEnum],
    }))
)

onUnmounted(() => {
    validateManager.clearInputs()
})

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100" v-if="!isLoading && authService.isAuthenticated()">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'id')" v-model="proxyModel.value.id"
                        label="Id" disabled :hideDetails="false" v-if="proxyModel.value.id != ''" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'name')"
                        :rules="validateManager.requiredMinMax('Name', 3, 150)" v-model="proxyModel.value.name" label="Name"
                        :hideDetails="false" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'data')"
                        :rules="validateManager.requiredMin('data', 3)" v-model="proxyModel.value.data" label="Data"
                        :hideDetails="false" />
                    <v-select :ref="el => validateManager.setInputRef(el, 'type')" :rules="validateManager.required('Type')"
                        v-model="proxyModel.value.type" class="mb-5" :items="resourceTypeOptions" label="Type"
                        item-value="value" item-title="label"></v-select>
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :hideDetails="false"></v-combobox>
                    <v-sheet class="d-flex justify-end ga-3">
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>
    </v-sheet>
</template>
