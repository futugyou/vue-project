<script lang="ts" setup>
import { ref, Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import {
    PlatformApiFactory, PlatformDetailView, CreatePlatformRequest,
    UpdatePlatformRequest, PropertyInfo, fieldRequiredCheck, fieldMaxLengthCheck, fieldMinLengthCheck
} from './platform'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()

const props = defineProps<{
    model?: PlatformDetailView,
}>()

const isLoading = ref(false)
const editModel = ref<PlatformDetailView>(props.model ?? {
    id: '',
    name: '',
    activate: true,
    is_deleted: false, // TODO, temporarily not processing deletion
    rest_endpoint: '',
    url: '',
    tags: [],
    property: [],
    projects: []
})

const rules = {
    Name: [
        (value: string) => fieldRequiredCheck(value, 'Name'),
        (value: string) => fieldMinLengthCheck(value, 'Name', 3),
        (value: string) => fieldMaxLengthCheck(value, 'Name', 50),
    ],
    RestUrl: [
        (value: string) => fieldRequiredCheck(value, 'Rest ebdpoint'),
        (value: string) => fieldMinLengthCheck(value, 'Rest ebdpoint', 3),
        (value: string) => fieldMaxLengthCheck(value, 'Rest ebdpoint', 50),
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
    let property = _.filter(editModel.value.property, (prop: PropertyInfo) => {
        const keyIsValid = prop.key && prop.key.trim() !== ''
        const valueIsValid = prop.value && prop.value.trim() !== ''
        return keyIsValid && valueIsValid
    }) as PropertyInfo[]

    let body: UpdatePlatformRequest | CreatePlatformRequest = {
        name: editModel.value.name,
        rest: editModel.value.rest_endpoint,
        url: editModel.value.url,
        activate: editModel.value.activate,
        tags: editModel.value.tags ?? [],
        property: property,
    }

    let response
    if (editModel.value.id) {
        response = await PlatformApiFactory().v1PlatformIdPut(body as UpdatePlatformRequest, editModel.value.id)
    } else {
        response = await PlatformApiFactory().v1PlatformPost(body as CreatePlatformRequest)
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

    editModel.value = data!
    emit('save', editModel.value)
}

const cancel = () => {
    emit('cancel')
}

const emit = defineEmits<{
    (e: 'update:model', model: PlatformDetailView): void
    (e: 'cancel'): void
    (e: 'save', model: PlatformDetailView): void
}>()

watch(editModel, (newVal) => {
    emit('update:model', newVal)
})

const addProperty = (model: Ref<PlatformDetailView>) => {
    const view = _.cloneDeep(model.value)

    if (!view.property) {
        view.property = []
    }

    view.property.push({ key: '', value: '', needMask: false })
    model.value = view
}

const removeProperty = (model: Ref<PlatformDetailView>, index: number) => {
    const view = _.cloneDeep(model.value)
    if (!view.property) {
        view.property = []
    }

    model.value = { ...view, property: view.property.filter((_, i) => i !== index) }
}

</script>

<template>
    <v-sheet>
        <Spinners v-if="isLoading"></Spinners>

        <v-card class="pa-3" v-if="!isLoading">
            <v-confirm-edit v-model="editModel" @cancel="cancel" @save="save">
                <template v-slot:default="{ model: proxyModel, actions }">
                    <v-text-field v-model="proxyModel.value.id" label="ID" disabled v-if="proxyModel.value.id"
                        :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'name')" v-model="proxyModel.value.name" label="Name"
                        :disabled="!authService.isAuthenticated()" :rules="rules.Name" :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'rest')" v-model="proxyModel.value.rest_endpoint"
                        :disabled="!authService.isAuthenticated()" label="REST Endpoint" :rules="rules.RestUrl"
                        :hideDetails="false" />
                    <v-text-field :ref="el => setInputRef(el, 'url')" v-model="proxyModel.value.url" label="URL"
                        :disabled="!authService.isAuthenticated()" :rules="rules.Url" :hideDetails="false" />
                    <v-switch v-model="proxyModel.value.activate" label="Activate" class="pl-2" color="info"
                        :disabled="!authService.isAuthenticated()" :hideDetails="false" />
                    <!-- <v-switch v-model="proxyModel.value.is_deleted" label="Is Deleted" /> -->
                    <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple
                        :disabled="!authService.isAuthenticated()" :hideDetails="false"></v-combobox>

                    <div>
                        <label class="v-label mt-3 pl-3">Properties</label>
                    </div>

                    <v-row v-for="(property, index) in proxyModel.value.property" :key="index" class="mt-2">
                        <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                            <v-text-field :ref="el => setInputRef(el, `p-key-${index}`)" v-model="property.key" label="Key"
                                :rules="rules.PropertyKey" :hideDetails="false"
                                :disabled="!authService.isAuthenticated()" />
                        </v-col>
                        <v-col :cols="authService.isAuthenticated() ? 4 : 5">
                            <v-text-field :ref="el => setInputRef(el, `p-value-${index}`)" v-model="property.value"
                                :type="property.needMask ? 'password' : 'text'" label="Value" :rules="rules.PropertyValue"
                                :hideDetails="false" :disabled="!authService.isAuthenticated()" />
                        </v-col>
                        <v-col cols="2">
                            <v-switch v-model="property.needMask" label="Mask" color="info"
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
