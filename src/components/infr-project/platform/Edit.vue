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
    <v-sheet class="d-flex flex-column align-center overflow-y-auto" height="100%">
        <v-text-field v-model="editModel.id" label="ID" />
        <v-text-field v-model="editModel.name" label="Name" />
        <v-text-field v-model="editModel.rest_endpoint" label="REST Endpoint" />
        <v-text-field v-model="editModel.url" label="URL" />
        <v-switch v-model="editModel.activate" label="Activate" />
        <v-switch v-model="editModel.is_deleted" label="Is Deleted" />
        <v-autocomplete v-model="editModel.tags" :items="availableTags" label="Tags" multiple />
        <v-combobox v-model="availableTags" label="Tags" chips multiple></v-combobox>
    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
