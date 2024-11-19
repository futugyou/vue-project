<script lang="ts" setup>
import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import Empty from '@/common/EmptyStates.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import WebhookPage from './Webhook.vue'

import { OperateEnum, PlatformApiFactory, UpdatePlatformProjectRequest, PlatformDetailView, PlatformProject } from './platform'
import { fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck } from '@/tools/util'

export interface PlatformProjectModel extends PlatformProject {
    propertyArray?: { key: string, value: string }[]
}

const convertProject = (model: PlatformProject | undefined): PlatformProjectModel => {
    if (model == undefined) {
        return { id: "", name: "", url: "", propertyArray: [], followed: false, properties: [], provider_project_id: "", secrets: [], webhooks: [] }
    }

    // TODO: fix properties
    // let propertyArray = convertPropperty(model.properties)
    model = _.cloneDeep(model)

    return {
        ...model,
        webhooks: _.orderBy(model.webhooks, 'name', 'asc'),
        // propertyArray: propertyArray,
    }
}

const convertPropperty = (property: { [key: string]: string; } | undefined): { key: string; value: string; }[] => {
    if (property == undefined) {
        return []
    }

    return _.map(property, (value, key) => ({ key, value }))
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
        // fix properties
        properties: [],
        operate: OperateEnum.Upsert,
        provider_project_id: '',
        secrets: []
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

const webhookCreated = (model: PlatformDetailView) => {
    emit('save', model)
}

const webhookCreateCanceled = () => {
    emit('cancel')
}

const addNewWebhook = () => {
    if (editModel.value.webhooks != undefined && editModel.value.webhooks.findIndex(p => p.name == "") > -1) {
        return
    }

    let view = _.cloneDeep(editModel.value)
    if (view.webhooks == undefined) {
        view = { ...view, webhooks: [{ name: "", url: "", properties: [], activate: true, state: 'Init', secrets: [] }] }
    } else {
        view.webhooks.push({ name: "", url: "", properties: [], activate: true, state: 'Init', secrets: [] })
    }
    editModel.value = view
}

watch(() => props.model, (newVal) => {
    editModel.value = convertProject(newVal)
})

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" minHeight="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-tabs v-model="tab" color="deep-purple-accent-4">
            <v-tab value="one">Project Basic</v-tab>
            <v-tab value="two" v-if="projectId">Webhooks</v-tab>
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
                                        :disabled="!logined" label="Key" :rules="rules.PropertyKey" :hideDetails="false" />
                                </v-col>
                                <v-col :cols="logined ? 5 : 6">
                                    <v-text-field :ref="el => setInputRef(el, `p-value-${index}`)" v-model="property.value"
                                        :disabled="!logined" label="Value" :rules="rules.PropertyValue"
                                        :hideDetails="false" />
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

            <v-tabs-window-item value="two" v-if="projectId">
                <Empty v-if="editModel.webhooks == undefined || editModel.webhooks.length == 0">
                    <v-btn icon="md:add" size="x-large" @click="addNewWebhook" elevation="8" v-if="logined"></v-btn>
                </Empty>
                <v-row class="pa-3" v-else>
                    <v-col v-for="webhook in editModel.webhooks" :key="webhook.name" cols="12" md="4">
                        <WebhookPage :platform-id="platformId" :project-id="projectId" :model="webhook"
                            @cancel="webhookCreateCanceled" @save="webhookCreated"></WebhookPage>
                    </v-col>
                    <v-col cols="12" md="4" v-if="logined">
                        <v-btn icon="md:add" size="x-large" @click="addNewWebhook"></v-btn>
                    </v-col>
                </v-row>
            </v-tabs-window-item>
        </v-tabs-window>

    </v-sheet>
</template>

<style scoped>
.v-window {
    width: 100%;
    height: 100%;
}

.v-window-item {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
