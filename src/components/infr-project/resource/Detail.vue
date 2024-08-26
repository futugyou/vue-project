<script lang="ts" setup>
import { ref, } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'

import Spinners from '@/common/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { useMessageStore } from '@/stores/message'

import { ResourceApiFactory, ResourceViewDetail } from './resource'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()

const isLoading = ref(true)
const resourceId = route.params.id as string
const histories = ref<ResourceViewDetail[]>()

const fetchData = async () => {
    if (resourceId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await ResourceApiFactory().v1ResourceIdHistoryGet(resourceId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    histories.value = data
}

fetchData()

</script>

<template>
    <v-sheet class="d-flex flex-column align-center" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-timeline align="start" v-if="!isLoading">
            <v-timeline-item v-for="(history, i) in histories" :key="i" fill-dot>
                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                    <template v-slot:title> {{ history.name }} </template>

                    <v-card-text class="d-flex flex-column ga-3 text-truncate">
                        <v-sheet class="d-flex flex-wrap ga-2">
                            <v-chip>
                                <strong>{{ history.type }}</strong>&nbsp;
                            </v-chip>
                            <v-chip>
                                <strong>{{ history.is_deleted ? 'deleted' : 'activated' }}</strong>&nbsp;
                            </v-chip>
                            <v-chip>
                                <strong>version: {{ history.version }}</strong>&nbsp;
                            </v-chip>
                            <v-chip v-for="tag in history.tags">
                                <strong>{{ tag }}</strong>&nbsp;
                            </v-chip>
                        </v-sheet>

                        <v-divider></v-divider>

                        <v-img :aspect-ratio="16 / 9" :src="history.data" width="100%">
                            <template v-slot:error>
                                <v-sheet>
                                    <div class="text-body-1 word-break">{{ history.data }}</div>
                                </v-sheet>
                            </template>
                        </v-img>

                        <v-divider></v-divider>

                        <div class="d-flex ga-2 justify-center">
                            <v-chip>CreatedAt: {{ useTimeFormat(history.created_at) }}</v-chip>
                            <v-chip>UpdatedAt: {{ useTimeFormat(history.updated_at) }}</v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-sheet>
</template>
