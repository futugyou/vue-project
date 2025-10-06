<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { shortTimeFormat } from '@/tools/timeFormat'
import { useAuth } from '@/plugins/auth'

import ResourceData from './ResourceData.vue'
import { useResources } from './resourceQuery'

const authService = useAuth()
const router = useRouter()

const { isPending: isLoading, data: resources, } = useResources()

const buildUrl = (id: string) => {
    const r = router.resolve({ name: 'ResourceDetail', params: { id } })
    return r.href
}

const createResource = () => {
    const r = router.resolve({ name: 'ResourceEdit' })
    window.open(r.href, '_blank')
}
</script>

<template>
    <v-sheet class="d-flex flex-wrap justify-center ga-3 pa-3 overflow-y-auto" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-row v-if="!isLoading">
            <v-col cols="12" md="1" v-if="authService.isAuthenticated()">
                <v-card class="d-flex flex-column" hover>
                    <v-card-text class="d-flex flex-column align-center ga-3">
                        <v-sheet>New Resource</v-sheet>
                        <v-btn icon="md:add" @click="createResource"></v-btn>
                        <v-sheet></v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col v-for="resource in resources" :key="resource.id" cols="12" md="3">
                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                    <template v-slot:title> {{ resource.name }} </template>

                    <template v-slot:append>
                        <a :href="buildUrl(resource.id!)" target="_blank">
                            <v-hover>
                                <template v-slot:default="{ isHovering, props }">
                                    <v-icon icon="md:open_in_new" v-bind="props"
                                        :color="isHovering ? '#75FBFD' : undefined"></v-icon>
                                </template>
                            </v-hover>
                        </a>
                    </template>

                    <v-card-text class="d-flex flex-column ga-3 text-truncate">
                        <v-sheet class="d-flex flex-wrap ga-2">
                            <v-chip>
                                <strong>{{ resource.type }}</strong>&nbsp;
                            </v-chip>
                            <v-chip>
                                <strong>{{ resource.is_deleted ? 'deleted' : 'activated' }}</strong>&nbsp;
                            </v-chip>
                            <v-chip>
                                <strong>version: {{ resource.version }}</strong>&nbsp;
                            </v-chip>
                            <v-chip v-for="tag in resource.tags">
                                <strong>{{ tag }}</strong>&nbsp;
                            </v-chip>
                        </v-sheet>

                        <v-divider></v-divider>

                        <ResourceData :data="resource.data" :type="resource.type" :imageData="resource.imageData"
                            :showDrawio="false" :id="resource.id">
                        </ResourceData>

                        <v-divider></v-divider>

                        <div class="d-flex ga-2 justify-center">
                            <v-chip>Created: {{ shortTimeFormat(resource.created_at) }}</v-chip>
                            <v-chip>Updated: {{ shortTimeFormat(resource.updated_at) }}</v-chip>
                        </div>
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
