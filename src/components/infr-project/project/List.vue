<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { shortTimeFormat } from '@/tools/timeFormat'
import { useAuth } from '@/plugins/auth'

import { useProjects } from './projectQuery'

const authService = useAuth()
const router = useRouter()

const { isPending: isLoading, data: projects, } = useProjects()

const buildUrl = (id: string) => {
    const r = router.resolve({ name: 'ProjectDetail', params: { id } })
    return r.href
}

const createProject = () => {
    const r = router.resolve({ name: 'ProjectEdit' })
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
                        <v-sheet>New Project</v-sheet>
                        <v-btn icon="md:add" @click="createProject"></v-btn>
                        <v-sheet></v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col v-for="project in projects" :key="project.id" cols="12" md="3">
                <v-card v-if="!isLoading" class="d-flex flex-column" hover>
                    <template v-slot:title> {{ project.name }} </template>

                    <template v-slot:append>
                        <a :href="buildUrl(project.id!)" target="_blank">
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
                                <strong>{{ project.state }}</strong>&nbsp;
                            </v-chip>
                            <v-chip v-for="tag in project.tags">
                                <strong>{{ tag }}</strong>&nbsp;
                            </v-chip>
                        </v-sheet>

                        <p class="mb-8">
                            {{ project.description ?? "" }}
                        </p>

                        <v-divider v-if="project.start_time || project.end_time"></v-divider>
                        <div class="d-flex ga-2 justify-space-between" v-if="project.start_time || project.end_time">
                            <v-chip v-if="project.start_time">Start: {{ shortTimeFormat(project.start_time) }}</v-chip>
                            <v-chip v-if="project.end_time">End: {{ shortTimeFormat(project.end_time) }}</v-chip>
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
