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
const platformId = route.params.id as string
const detail = ref<PlatformDetailView>()

const tab = ref()

const fetchData = async () => {
    if (platformId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformIdGet(platformId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    detail.value = data
}

fetchData()

</script>

<template>
    <v-sheet class="d-flex flex-column align-center overflow-y-auto" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" v-if="!isLoading">
            <v-tab value="one" text="Base"></v-tab>
            <v-tab value="two" text="Projects"></v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" v-if="!isLoading" grow>
            <v-tabs-window-item value="one" v-if="detail != undefined">
                <v-list lines="two">
                    <v-list-item title="Name" :subtitle="detail.name"></v-list-item>
                    <v-list-item title="URL">
                        <template v-slot:subtitle>
                            <a :href="detail.url" target="_blank">{{ detail.url }}</a>
                        </template>
                    </v-list-item>
                    <v-list-item title="Rest Endpoint" :subtitle="detail.rest_endpoint"></v-list-item>
                    <v-list-item title="Activate" :subtitle="detail.activate + ''"></v-list-item>
                    <v-list-item title="Deleted" :subtitle="detail.is_deleted + ''"></v-list-item>
                    <v-list-item>
                        <v-sheet class="d-flex flex-wrap ga-2">
                            <v-chip v-for="tag in detail.tags">
                                <strong>{{ tag }}</strong>&nbsp;
                            </v-chip>
                        </v-sheet>
                    </v-list-item>
                    <v-list-group>
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" title="Property"></v-list-item>
                        </template>
                        <v-list-item v-for="pp in detail.property">
                            <span class="text-subtitle-1 mr-1">key:</span>
                            <span class="text-subtitle-2 mr-3">{{ pp.key }}</span>
                            <span class="text-subtitle-1 mr-1">value:</span>
                            <span class="text-subtitle-2">{{ pp.value }}</span>
                        </v-list-item>
                    </v-list-group>
                </v-list>

            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="detail != undefined && detail.projects != undefined">
                <v-row class="pa-3">
                    <v-col v-for="project in detail.projects" :key="project.id" cols="12" md="4">
                        <v-card v-if="!isLoading" class="d-flex flex-column pa-2" hover>
                            <template v-slot:title>Name: {{ project.name }} </template>
                            <template v-slot:subtitle>ID: {{ project.id }} </template>

                            <template v-slot:append>
                                <a :href="project.url" target="_blank">
                                    <v-hover>
                                        <template v-slot:default="{ props }">
                                            <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                                        </template>
                                    </v-hover>
                                </a>
                            </template>

                            <v-list lines="one">
                                <v-list-subheader>Property</v-list-subheader>
                                <v-list-item v-for="(value, key) in project.property" :key="key">
                                    <span class="text-subtitle-1 mr-1">key:</span>
                                    <span class="text-subtitle-2 mr-3">{{ key }}</span>
                                    <span class="text-subtitle-1 mr-1">value:</span>
                                    <span class="text-subtitle-2">{{ value }}</span>
                                </v-list-item>
                            </v-list>

                            <v-expansion-panels>
                                <v-expansion-panel v-for="webhook in project.webhooks" :key="webhook.name"
                                    :title="webhook.name">
                                    <v-expansion-panel-text>
                                        <v-list-item title="State" :subtitle="webhook.state"></v-list-item>
                                        <v-list-item title="Activate"
                                            :subtitle="webhook.activate ? 'Yes' : 'No'"></v-list-item>
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
                    </v-col>
                </v-row>
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
