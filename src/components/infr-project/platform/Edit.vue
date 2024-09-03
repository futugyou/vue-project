<script lang="ts" setup>
import { ref, } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import { timeFormat } from '@/tools/timeFormat'
import { useMessageStore } from '@/stores/message'

import { PlatformApiFactory, PlatformDetailView } from './platform'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()

const isLoading = ref(true)
const editModel = ref<PlatformDetailView>({
    id: '',
    name: '',
    activate: true,
    is_deleted: false,
    rest_endpoint: '',
    url: '',
    tags: [],
    property: [],
    projects: []
})
const availableTags = ref<string[]>([])

</script>

<template>
    <v-sheet class="d-flex flex-column ga-3" height="100%">
        <v-confirm-edit v-model="editModel">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-text-field v-model="proxyModel.value.id" label="ID" />
                <v-text-field v-model="proxyModel.value.name" label="Name" />
                <v-text-field v-model="proxyModel.value.rest_endpoint" label="REST Endpoint" />
                <v-text-field v-model="proxyModel.value.url" label="URL" />
                <v-switch v-model="proxyModel.value.activate" label="Activate" />
                <v-switch v-model="proxyModel.value.is_deleted" label="Is Deleted" />
                <v-combobox v-model="proxyModel.value.tags" label="Tags" chips multiple></v-combobox>
                <v-spacer></v-spacer>
                <v-sheet class="d-flex justify-end ga-3">
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
}
</style>
