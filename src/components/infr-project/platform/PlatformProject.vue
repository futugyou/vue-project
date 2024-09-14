<script lang="ts" setup>
import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import { PlatformApiFactory, UpdatePlatformProjectRequest, PlatformDetailView, PlatformProject, fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck } from './platform'

export interface PlatformProjectModel extends PlatformProject {
    propertyArray?: { key: string, value: string }[]
}

const convertProject = (mode: PlatformProject | undefined): PlatformProjectModel => {
    if (mode == undefined) {
        return { id: "", name: "", url: "", propertyArray: [] }
    }

    let propertyArray: { key: string, value: string }[] = []
    if (mode?.property) {
        propertyArray = _.map(mode.property, (value, key) => ({ key, value }))
    }
    return {
        ..._.cloneDeep(mode),
        propertyArray: propertyArray,
    }
}

const store = useMessageStore()
const { msg } = storeToRefs(store)

const authService = useAuth()
const logined = authService.isAuthenticated()

const props = defineProps<{
    platformId: string,
    projectId?: string,
    model?: PlatformProject,
}>()

const isLoading = ref(false)
const editModel = ref<PlatformProjectModel>(convertProject(props.model))

const dialog = ref(false)
const tab = ref("one")

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
            const message: string[] = await input.validate(false)
            if (message && message.length > 0) {
                validateMsg = [...validateMsg, ...message]
            }
        }
    }

    if (validateMsg.length > 0) {
        return
    }

    isLoading.value = true

    let arr = _.filter(editModel.value.propertyArray, (prop) => {
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

const addProperty = (model: Ref<PlatformProjectModel>) => {
    const view = _.cloneDeep(model.value)

    if (!view.propertyArray) {
        view.propertyArray = []
    }

    view.propertyArray.push({ key: '', value: '', })
    model.value = view
}

const removeProperty = (model: Ref<PlatformProjectModel>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.propertyArray) {
        view.propertyArray = []
    }

    model.value = { ...view, propertyArray: view.propertyArray.filter((_, i) => i !== index) }
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
    editModel.value = convertProject(newVal)
})

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Project Basic</v-tab>
            <v-tab value="two">Webhooks</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" v-if="!isLoading">
            <v-tabs-window-item value="one">

                <v-card class="h-100">
                    <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                        <template v-slot:default="{ model: proxyModel, actions }">
                            <v-text-field :model-value="projectId" label="Id" disabled v-if="projectId"
                                :hideDetails="false" />
                            <v-text-field :ref="el => setInputRef(el, 'name')" v-model="proxyModel.value.name"
                                :disabled="!logined" :rules="rules.Name" label="Name" :hideDetails="false" />
                            <v-text-field :ref="el => setInputRef(el, 'url')" v-model="proxyModel.value.url"
                                :disabled="!logined" :rules="rules.Url" label="URL" :hideDetails="false" />

                            <div>
                                <label class="v-label mt-3 pl-3">Properties</label>
                            </div>

                            <v-row v-for="(property, index) in proxyModel.value.propertyArray" :key="index">
                                <v-col :cols="logined ? 5 : 6">
                                    <v-text-field :ref="el => setInputRef(el, `p-key-${index}`)" v-model="property.key"
                                        :disabled="!logined" label="Key" :rules="rules.PropertyKey"
                                        :hideDetails="false" />
                                </v-col>
                                <v-col :cols="logined ? 5 : 6">
                                    <v-text-field :ref="el => setInputRef(el, `p-value-${index}`)"
                                        v-model="property.value" :disabled="!logined" label="Value"
                                        :rules="rules.PropertyValue" :hideDetails="false" />
                                </v-col>
                                <v-col cols="2" class="pt-4" v-if="logined">
                                    <v-btn icon @click="removeProperty(proxyModel, index)">
                                        <v-icon icon="md:remove"></v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <v-btn color="primary" @click="addProperty(proxyModel)" v-if="logined">Add Property</v-btn>

                            <v-spacer></v-spacer>
                            <v-sheet class="d-flex justify-end ga-3" v-if="logined">
                                <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel"
                                    v-model:dialog="dialog" @save="deleteProject" v-if="projectId">
                                    <v-alert text="Are you sure you want to delete?"></v-alert>
                                </VuetifyModal>
                                <component :is="actions"></component>
                            </v-sheet>
                        </template>
                    </v-confirm-edit>
                </v-card>

            </v-tabs-window-item>

            <v-tabs-window-item value="two">
                <v-card>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="webhook in editModel.webhooks" :key="webhook.name"
                            :title="webhook.name">
                            <v-expansion-panel-text>
                                <v-list-item title="State" :subtitle="webhook.state"></v-list-item>
                                <v-list-item title="Activate" :subtitle="webhook.activate ? 'Yes' : 'No'"></v-list-item>
                                <v-list-item title="Url" :subtitle="webhook.url"></v-list-item>
                                <v-list-group>
                                    <template v-slot:activator="{ props }">
                                        <v-list-item v-bind="props" title="Property"></v-list-item>
                                    </template>
                                    <v-list-item v-for="(v, k) in webhook.property">
                                        <span class="text-subtitle-1 mr-1">key:</span>
                                        <span class="text-subtitle-2 mr-3">{{ v }}</span>
                                        <span class="text-subtitle-1 mr-1">value:</span>
                                        <span class="text-subtitle-2">{{ k }}</span>
                                    </v-list-item>
                                </v-list-group>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>

    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
