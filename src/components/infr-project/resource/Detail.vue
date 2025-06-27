<script lang="ts" setup>
import { ref, } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { timeFormat } from '@/tools/timeFormat'
import { useAuth } from '@/plugins/auth'

import ResourceData from './ResourceData.vue'
import type { ResourceViewDetail } from './resource'
import { useResourceHistory } from './resourceQuery'

const authService = useAuth()

const route = useRoute()
const router = useRouter()

const resourceId = route.params.id as string
const { isPending: isLoading, data: histories, } = useResourceHistory(resourceId)

const dispalyTime = (history: ResourceViewDetail) => {
    var t = timeFormat(history.updated_at)
    if (t == "-") {
        t = timeFormat(history.created_at)
    }
    return t
}

const newResourceVersion = () => {
    window.open(router.resolve({ path: '/resource/edit', query: { id: resourceId } }).href, '_blank')
}

</script>

<template>
    <v-sheet class="d-flex flex-column align-center overflow-y-auto" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-timeline v-if="!isLoading" align="start" justify="center" class="w-100">
            <v-timeline-item dot-color="indigo-lighten-2" icon="md:schedule" v-if="authService.isAuthenticated()">
                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                    <v-card-text class="d-flex flex-column align-center ga-3">
                        <v-sheet>New Version</v-sheet>
                        <v-btn icon="md:add" @click="newResourceVersion"></v-btn>
                        <v-sheet></v-sheet>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
            <v-timeline-item v-for="(history, i) in histories" :key="i" dot-color="indigo-lighten-2" icon="md:schedule"
                class="w-100 pa-5">
                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                    <template v-slot:title> {{ dispalyTime(history) }} </template>

                    <template v-slot:subtitle> {{ history.name }} </template>

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

                        <ResourceData :data="history.data" :type="history.type" :imageData="history.imageData"
                            :id="history.id">
                        </ResourceData>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-sheet>
</template>
