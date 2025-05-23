<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { isEqual, cloneDeep } from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import { ResourceApiFactory, ResourceTypeEnum } from './resource'

import type { CreateResourceRequest, UpdateResourceRequest } from './resource'

import { ValidateManager } from '@/tools/validate'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()

const route = useRoute()
const router = useRouter()
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
    if (resourceId.length == 0) {
        router.push({ name: "Resource", force: true, })
    } else {
        router.push({ name: "ResourceDetail", force: true, params: { id: resourceId } })
    }
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
    let response
    if (resourceId.length == 0) {
        const r_type: unknown = editModel.value.type ?? ""
        const res_type = Object.values(ResourceTypeEnum).includes(r_type as ResourceTypeEnum)
            ? (r_type as ResourceTypeEnum)
            : ResourceTypeEnum.Markdown
        const request: CreateResourceRequest = {
            data: editModel.value.data,
            name: editModel.value.name,
            tags: editModel.value.tags,
            type: res_type,
        }
        response = await ResourceApiFactory().v1ResourcePost(request)
    } else {
        const request: UpdateResourceRequest = {
            data: editModel.value.data,
            name: editModel.value.name,
            tags: editModel.value.tags,
        }
        response = await ResourceApiFactory().v1ResourceIdPut(request, resourceId)
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
        cancel()
    }
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
    window.removeEventListener('message', handleMessage)
})

onMounted(() => {
    window.addEventListener('message', handleMessage)
})

let popupWindow: Window | null = null;
const showDrawIO = () => {
    sessionStorage.setItem('drawio-edit-value', editModel.value.data)
    popupWindow = window.open('/drawio', '_blank')
}

const handleMessage = (event: MessageEvent) => {
    if (event.origin !== location.origin) return;
    if (event.data?.type == "drawio-export-event") {
        console.log(event.data)
        editModel.value = {
            ...cloneDeep(editModel.value),
            data: event.data.xml,
        }
    }
}

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
                        :rules="validateManager.requiredMinMax('Name', 3, 150)" v-model="proxyModel.value.name"
                        label="Name" :hideDetails="false" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'data')"
                        :rules="validateManager.requiredMin('data', 3)" v-model="proxyModel.value.data" label="Data"
                        :hideDetails="false" />
                    <v-select :ref="el => validateManager.setInputRef(el, 'type')"
                        :rules="validateManager.required('Type')" v-model="proxyModel.value.type" class="mb-5"
                        :items="resourceTypeOptions" label="Type" item-value="value" item-title="label"></v-select>
                    <v-btn text="show drawio" @click="showDrawIO" v-if="proxyModel.value.type == 'DrawIO'"></v-btn>
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
