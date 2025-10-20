<script lang="ts" setup>
import { ref, } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { timeFormat } from '@/tools/timeFormat'
import { useAuth } from '@/plugins/auth'
import { patchWindowOpen } from '@/tools/util'

import ResourceData from './ResourceData.vue'
import type { ResourceViewDetail } from './resource'
import { useResourceHistory } from './resourceQuery'

const authService = useAuth()

const route = useRoute()
const router = useRouter()
const resourceDataRef = ref([])

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
    let r = router.resolve({ path: '/resource/edit', query: { id: resourceId } })
    patchWindowOpen(r.href)
}

let popupWindow: Window | null = null;
const showDrawIO = (i: number, data: ResourceViewDetail) => {
    const item = resourceDataRef.value?.[i] as any
    if (item) {
        item.showDrawIOPage()
        return
    }
    
    sessionStorage.setItem('drawio-edit-value', data.data)
    const r = router.resolve({ name: 'Drawio', query: { suffix: resourceId } })
    patchWindowOpen(r.href)
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
                    <template v-slot:append>
                        <v-tooltip text="show drawio" v-if="history.type == 'DrawIO'" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon icon="md:open_in_new" v-bind="props" class="ma-2"
                                    @click="() => showDrawIO(i, history)"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>

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

                        <ResourceData ref="resourceDataRef" :data="history.data" :type="history.type"
                            :imageData="history.imageData" :showDrawio="false" :id="history.id">
                        </ResourceData>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-sheet>
</template>
