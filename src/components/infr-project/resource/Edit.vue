<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useQueryClient } from '@tanstack/vue-query'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import { ResourceApiFactory, ResourceTypeEnum } from './resource'
import type { CreateResourceRequest, UpdateResourceRequest } from './resource'
import { ValidateManager } from '@/tools/validate'
import { formatContent } from '@/tools/textFormat'
import { useResource } from './resourceQuery'
import ResourceData from './ResourceData.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const queryClient = useQueryClient()
const authService = useAuth()

const route = useRoute()
const router = useRouter()
const validateManager = ValidateManager()

const resourceId = (route.query.id ?? "") as string
const { isPending: isLoading, data } = useResource(resourceId)

interface ResourceEditModel {
    id: string
    name: string
    type: string
    data: string
    imageData: string
    tags: Array<string>
}

const DefaultResourceEditModel: ResourceEditModel = {
    id: resourceId,
    name: "",
    type: "Markdown",
    data: "",
    imageData: "",
    tags: []
}

const editModel = ref<ResourceEditModel>(DefaultResourceEditModel)
const imagePreview = ref(false)
const proxyModelRef = ref()

const cancel = () => {
    if (resourceId.length == 0) {
        router.push({ name: "Resource", force: true, })
    } else {
        router.push({ name: "ResourceDetail", force: true, params: { id: resourceId } })
    }
}

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
            imageData: editModel.value.imageData,
            type: res_type,
        }
        response = await ResourceApiFactory().v1ResourcePost(request)
    } else {
        const request: UpdateResourceRequest = {
            data: editModel.value.data,
            name: editModel.value.name,
            tags: editModel.value.tags,
            imageData: editModel.value.imageData,
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
        queryClient.invalidateQueries({ queryKey: ['resourceList'] })
        queryClient.invalidateQueries({ queryKey: ['resource', resourceId] })
        queryClient.invalidateQueries({ queryKey: ['resource-history', resourceId] })
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
    sessionStorage.removeItem('drawio-edit-value')
})

onMounted(() => {
    window.addEventListener('message', handleMessage)
})

watch(data, (newVal) => {
    if (newVal) {
        editModel.value = cloneDeep(newVal)
    }
}, { immediate: true })

let popupWindow: Window | null = null;
const showDrawIO = (data: ResourceEditModel) => {
    // this is for drawio
    sessionStorage.setItem('drawio-edit-value', data.data)
    popupWindow = window.open('/drawio?suffix=' + resourceId, '_blank')
}

const handleMessage = (event: MessageEvent) => {
    if (event.origin !== location.origin) return;
    if (event.data?.type == "drawio-export-event") {
        if (proxyModelRef.value) {
            proxyModelRef.value.data = event.data.xml
            proxyModelRef.value.imageData = event.data.data
        }
    }
}

const getFormatTetx = (text: string) => {
    const { formatted: result } = formatContent(text)
    return result
}

const bindProxy = (proxy: any) => {
    if (!proxyModelRef.value) {
        proxyModelRef.value = proxy.value
    }
    return true
}

const HandleResourceChanged = (text: string | string[], type: string) => {
    if (proxyModelRef.value) {
        proxyModelRef.value[type] = text
    }
}
</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100 pa-5 ga-5" v-if="!isLoading && authService.isAuthenticated()" style="overflow-y: auto;">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'id')" v-model="proxyModel.value.id"
                        label="Id" disabled :hideDetails="false" v-if="proxyModel.value.id != ''" />
                    <v-text-field :ref="el => validateManager.setInputRef(el, 'name')"
                        :rules="validateManager.requiredMinMax('Name', 3, 150)" :model-value="proxyModel.value.name"
                        @update:modelValue="value => HandleResourceChanged(value, 'name')" label="Name"
                        :hideDetails="false" />

                    <v-textarea :counter="300" class="mb-5" rows="10" variant="outlined"
                        :ref="el => validateManager.setInputRef(el, 'data')"
                        :rules="validateManager.requiredMin('data', 3)" label="Data"
                        :model-value="getFormatTetx(proxyModel.value.data)"
                        @update:modelValue="value => HandleResourceChanged(value, 'data')"></v-textarea>

                    <v-sheet class="d-flex">
                        <v-select :ref="el => validateManager.setInputRef(el, 'type')"
                            :disabled="proxyModel.value.id != ''" :rules="validateManager.required('Type')"
                            :model-value="proxyModel.value.type"
                            @update:modelValue="value => HandleResourceChanged(value, 'type')" class="mb-5"
                            :items="resourceTypeOptions" label="Type" item-value="value" item-title="label"></v-select>
                        <v-tooltip text="show drawio" v-if="proxyModel.value.type == 'DrawIO'">
                            <template v-slot:activator="{ props }">
                                <v-icon icon="md:info" v-bind="props" class="ma-2"
                                    @click="() => showDrawIO(proxyModel.value)"></v-icon>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="preview">
                            <template v-slot:activator="{ props }">
                                <v-icon icon="md:image" v-bind="props" class="ma-2"
                                    @click="imagePreview = !imagePreview"></v-icon>
                            </template>
                        </v-tooltip>
                    </v-sheet>

                    <v-combobox label="Tags" chips multiple :hideDetails="false" :model-value="proxyModel.value.tags"
                        @update:modelValue="value => HandleResourceChanged(value, 'tags')"></v-combobox>

                    <span v-if="bindProxy(proxyModel)" style="display:none;" />

                    <v-sheet class="d-flex justify-end ga-3">
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>

            <ResourceData :data="proxyModelRef.data" :type="proxyModelRef.type" :imageData="proxyModelRef.imageData"
                :id="proxyModelRef.id" v-if="imagePreview && proxyModelRef">
            </ResourceData>
        </v-card>
    </v-sheet>
</template>
