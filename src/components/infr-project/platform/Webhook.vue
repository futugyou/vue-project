<script lang="ts" setup>
import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { useAuth } from '@/plugins/auth'

import { PlatformApiFactory, UpdatePlatformWebhookRequest, Webhook, WebhookStateEnum, PlatformDetailView, fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck } from './platform'

export interface WebhookModel extends Webhook {
    propertyArray?: { key: string, value: string }[]
}

const convertWebhook = (mode: Webhook | undefined): WebhookModel => {
    if (mode == undefined) {
        return { name: "", url: "", propertyArray: [], activate: true, state: 'Init' }
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

const props = defineProps<{
    model?: Webhook,
    platformId: string,
    projectId: string,
}>()

const isLoading = ref(false)
const dialog = ref(false)
const editModel = ref<WebhookModel>(convertWebhook(props.model))

const rules = {
    Name: [
        (value: string) => fieldRequiredCheck(value, 'Name'),
        (value: string) => fieldMinLengthCheck(value, 'Name', 3),
        (value: string) => fieldMaxLengthCheck(value, 'Name', 50),
    ],
    Url: [
        (value: string) => fieldRequiredCheck(value, 'Url'),
        (value: string) => fieldMinLengthCheck(value, 'Url', 3),
        (value: string) => fieldMaxLengthCheck(value, 'Url', 150),
    ],
    PropertyKey: [
        (value: string) => fieldRequiredCheck(value, 'Property key'),
        (value: string) => fieldMinLengthCheck(value, 'Property key', 3),
    ],
    PropertyValue: [
        (value: string) => fieldRequiredCheck(value, 'Property value'),
        (value: string) => fieldMinLengthCheck(value, 'Property value', 3),
    ],
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

    const state: unknown = editModel.value.state ?? ""
    let body: UpdatePlatformWebhookRequest = {
        name: editModel.value.name ?? "",
        url: editModel.value.url ?? "",
        activate: editModel.value.activate ?? true,
        property: property,
        state: Object.values(WebhookStateEnum).includes(state as WebhookStateEnum)
            ? (state as WebhookStateEnum)
            : WebhookStateEnum.Init,
    }

    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdHookPut(body, props.platformId, props.projectId)

    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    emit('save', data!)
}

const deleteWebhook = async () => {
    const hook_name = editModel.value.name.trim()
    if (hook_name.length == 0) {
        return
    }

    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformIdProjectProjectIdHookDelete(props.platformId, props.projectId, hook_name)
    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    emit('save', data!)
}

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', model: Webhook): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

watch(() => props.model, (newVal) => {
    editModel.value = convertWebhook(newVal)
})

const addProperty = (model: Ref<WebhookModel>) => {
    const view = _.cloneDeep(model.value)

    if (!view.propertyArray) {
        view.propertyArray = []
    }

    view.propertyArray.push({ key: '', value: '', })
    model.value = view
}

const removeProperty = (model: Ref<WebhookModel>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.propertyArray) {
        view.propertyArray = []
    }

    model.value = { ...view, propertyArray: view.propertyArray.filter((_, i) => i !== index) }
}

</script>

<template>
    <v-sheet>
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="pa-3" v-if="!isLoading">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field :ref="el => setInputRef(el, 'name')" v-model="proxyModel.value.name" label="Name"
                        :disabled="!authService.isAuthenticated()" :rules="rules.Name" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'url')" v-model="proxyModel.value.url" label="URL"
                        :disabled="!authService.isAuthenticated()" :rules="rules.Url" :hideDetails="false" />
                    <v-select label="State" v-model="proxyModel.value.state" :ref="el => setInputRef(el, 'state')"
                        :items="['Init', 'Creating', 'Ready']" :hideDetails="false" class="mt-2"></v-select>
                    <v-switch v-model="proxyModel.value.activate" label="Activate" class="pl-2" color="info"
                        :hideDetails="false" :disabled="!authService.isAuthenticated()" />
                    <div>
                        <label class="v-label  pl-3">Properties</label>
                    </div>

                    <v-row v-for="(property, index) in proxyModel.value.propertyArray" :key="index" class="mt-2">
                        <v-col :cols="authService.isAuthenticated() ? 5 : 6">
                            <v-text-field :ref="el => setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                                :rules="rules.PropertyKey" :hideDetails="false"
                                :disabled="!authService.isAuthenticated()" />
                        </v-col>
                        <v-col :cols="authService.isAuthenticated() ? 5 : 6">
                            <v-text-field :ref="el => setInputRef(el, `p-value-${index}`)" v-model="property.value"
                                label="Value" :rules="rules.PropertyValue" :hideDetails="false"
                                :disabled="!authService.isAuthenticated()" />
                        </v-col>
                        <v-col cols="2" class="pt-4" v-if="authService.isAuthenticated()">
                            <v-btn icon @click="removeProperty(proxyModel, index)">
                                <v-icon icon="md:remove"></v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-btn color="primary" @click="addProperty(proxyModel)" v-if="authService.isAuthenticated()">Add
                        Property</v-btn>

                    <v-spacer></v-spacer>
                    <v-sheet class="d-flex justify-end ga-3" v-if="authService.isAuthenticated()">
                        <VuetifyModal title="DELETE" text="Delete" ok-text="Delete" cancle-text="Cancel"
                            v-model:dialog="dialog" @save="deleteWebhook">
                            <v-alert text="Are you sure you want to delete?"></v-alert>
                        </VuetifyModal>
                        <component :is="actions"></component>
                    </v-sheet>
                </template>
            </v-confirm-edit>
        </v-card>

    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
