<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import { useTimeFormat } from '@/composables/timeFormat'
import { useMessageStore } from '@/stores/message'

import { ResourceView, ResourceApiFactory } from './resource'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const resources = ref<ResourceView[]>([])
const isLoading = ref(true)

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await ResourceApiFactory().v1ResourceGet()
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    resources.value = data ?? []
}

watchEffect(async () => fetchData())

const buildUrl = (id: string) => '/resource/' + id
</script>

<template>
    <v-sheet class="d-flex flex-wrap justify-center ga-3 pa-3 overflow-y-auto" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-row v-if="!isLoading">
            <v-col v-for="resource in resources" :key="resource.id" cols="12" md="4">
                <v-card :title="resource.name" v-if="!isLoading" class="d-flex flex-column" :href="buildUrl(resource.id!)"
                    target="_blank" append-icon="mdi-open-in-new" hover>
                    <v-card-text class="d-flex flex-column ga-3 text-truncate">
                        <v-sheet class="d-flex flex-wrap ga-2">
                            <v-chip>
                                <strong>{{ resource.type }}</strong>&nbsp;
                            </v-chip>
                            <v-chip>
                                <strong>{{ resource.is_deleted ? 'deleted' : 'activated' }}</strong>&nbsp;
                            </v-chip>
                            <v-chip v-for="tag in resource.tags">
                                <strong>{{ tag }}</strong>&nbsp;
                            </v-chip>
                        </v-sheet>

                        <v-divider></v-divider>

                        <v-img :aspect-ratio="1" :src="resource.data">
                            <template v-slot:error>
                                <v-sheet>
                                    <span class="text-body-1 word-break">{{ resource.data }}</span>
                                </v-sheet>
                            </template>
                        </v-img>

                        <v-divider></v-divider>

                        <v-chip-group>
                            <v-chip>CreatedAt: {{ useTimeFormat(resource.created_at) }}</v-chip>
                            <v-chip>UpdatedAt: {{ useTimeFormat(resource.updated_at) }}</v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

    </v-sheet>
</template>

<style scoped>
a:active,
a:hover {
    outline-width: 0;
    background-color: transparent;
}
</style>
