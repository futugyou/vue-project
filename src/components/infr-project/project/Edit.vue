<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useQueryClient } from '@tanstack/vue-query'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import { ProjectStateEnum } from './project'
import type { CreateProjectRequest } from './project'
import { ValidateManager } from '@/tools/validate'
import { formatContent } from '@/tools/textFormat'
import { useProject } from './projectQuery'
import ResourceData from './ResourceData.vue'

interface ProjectEditModel {
    id: string
    name: string
    tags: Array<string>
    description: string,
    end_date: string,
    start_date: string,
    state: ProjectStateEnum,
}

const store = useMessageStore()
const { msg } = storeToRefs(store)
const queryClient = useQueryClient()
const authService = useAuth()

const route = useRoute()
const router = useRouter()
const validateManager = ValidateManager()

const projectId = (route.query.id ?? "") as string
const DefaultProjectEditModel: ProjectEditModel = {
    id: projectId,
    description: "",
    end_date: "",
    name: "",
    start_date: "",
    state: ProjectStateEnum.Preparing,
    tags: []
}

const { isPending: isLoading, data } = useProject(projectId)

const imagePreview = ref(false)
const proxyModelRef = ref()

const cancel = () => {
}

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }
}

const editModel = ref<CreateProjectRequest>(DefaultProjectEditModel)

const projectTypeOptions = computed(() =>
    Object.keys(ProjectStateEnum).map((key) => ({
        label: key,
        value: ProjectStateEnum[key as keyof typeof ProjectStateEnum],
    }))
)

onUnmounted(() => {
    validateManager.clearInputs()
})

onMounted(() => {
})

watch(data, (newVal) => {
    if (newVal) {
        editModel.value = cloneDeep(newVal)
    }
}, { immediate: true })

const bindProxy = (proxy: any) => {
    if (!proxyModelRef.value) {
        proxyModelRef.value = proxy.value
    }
    return true
}

const HandleProjectChanged = (text: string | string[], type: string) => {
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
                        @update:modelValue="value => HandleProjectChanged(value, 'name')" label="Name"
                        :hideDetails="false" />

                    <v-textarea :counter="300" class="mb-5" rows="10" variant="outlined"
                        :ref="el => validateManager.setInputRef(el, 'description')"
                        :rules="validateManager.requiredMin('description', 3)" label="description"
                        :model-value="proxyModel.value.description"
                        @update:modelValue="value => HandleProjectChanged(value, 'description')"></v-textarea>


                    <v-select :ref="el => validateManager.setInputRef(el, 'state')"
                        :disabled="proxyModel.value.id != ''" :rules="validateManager.required('state')"
                        :model-value="proxyModel.value.state"
                        @update:modelValue="value => HandleProjectChanged(value, 'state')" class="mb-5"
                        :items="projectTypeOptions" label="state" item-value="value" item-title="label"></v-select>

                    <v-combobox label="Tags" chips multiple :hideDetails="false" :model-value="proxyModel.value.tags"
                        @update:modelValue="value => HandleProjectChanged(value, 'tags')"></v-combobox>

                    <span v-if="bindProxy(proxyModel)" style="display:none;" />

                    <v-sheet class="d-flex justify-end ga-3">
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>
    </v-sheet>
</template>
