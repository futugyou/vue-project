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
import { useProject, useProjectCreate, useProjectUpdate } from './projectQuery'

interface ProjectEditModel {
    id: string
    name: string
    tags: Array<string>
    description: string,
    end_time: string,
    start_time: string,
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
    end_time: "",
    name: "",
    start_time: "",
    state: ProjectStateEnum.Preparing,
    tags: []
}

const { isPending: isProjectPending, data } = useProject(projectId)
const { isPending: isCreatePending, mutateAsync: createMutate } = useProjectCreate(true)
const { isPending: isUpdatePending, mutateAsync: updateMutate } = useProjectUpdate(true)


const isLoading = computed(() => isProjectPending.value || isCreatePending.value || isUpdatePending.value)

const proxyModelRef = ref()

const cancel = () => {
}

const editModel = ref<ProjectEditModel>(DefaultProjectEditModel)

const save = async () => {
    const validateMsg = await validateManager.validateInputs()
    if (validateMsg.length > 0) {
        return
    }

    if (projectId.length == 0) {
        var create: CreateProjectRequest = {
            description: editModel.value.description,
            end_time: editModel.value.end_time,
            name: editModel.value.name,
            start_time: editModel.value.start_time,
            state: editModel.value.state,
            tags: editModel.value.tags
        }

        try {
            await createMutate(create)
            queryClient.invalidateQueries({ queryKey: ['projectList'] })
        } finally {
        }
    } else {
        const update = {
            id: projectId, body: {
                description: editModel.value.description,
                end_time: editModel.value.end_time,
                name: editModel.value.name,
                start_time: editModel.value.start_time,
                state: editModel.value.state,
                tags: editModel.value.tags
            }
        }

        try {
            await updateMutate(update)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
            queryClient.invalidateQueries({ queryKey: ['projectList'] })
        } finally {
        }
    }
}

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

const HandleProjectChanged = (text: any, type: string) => {
    if (proxyModelRef.value) {
        proxyModelRef.value[type] = text
    }
}

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card class="h-100 pa-5 ga-5" v-if="!isLoading" style="overflow-y: auto;">
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

                    <v-sheet class="mb-4">
                        <v-date-input prepend-icon="" prepend-inner-icon="$calendar" variant="solo"
                            :ref="el => validateManager.setInputRef(el, 'start_time')"
                            :rules="validateManager.required('start_time')" :model-value="proxyModel.value.start_time"
                            @update:modelValue="value => HandleProjectChanged(value, 'start_time')"
                            label="Select start date"></v-date-input>
                    </v-sheet>

                    <v-sheet class="mb-4">
                        <v-date-input prepend-icon="" prepend-inner-icon="$calendar" variant="solo"
                            :ref="el => validateManager.setInputRef(el, 'end_time')"
                            :model-value="proxyModel.value.end_time"
                            @update:modelValue="value => HandleProjectChanged(value, 'end_time')"
                            label="Select end date"></v-date-input>
                    </v-sheet>

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
