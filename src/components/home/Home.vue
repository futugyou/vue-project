<script setup lang="ts">

import { ref } from 'vue'
import SearchBox from '@/common/SearchBox.vue'


interface SubProject {
    name: string
    progress: number
}

interface Project {
    name: string
    progress: number
    subs: SubProject[]
}

const projects = ref<Project[]>([
    {
        name: 'AWS',
        progress: 75,
        subs: [
            { name: 'account', progress: 80 },
            { name: 'ecs', progress: 60 },
            { name: 'parameter', progress: 90 },
            { name: 's3', progress: 70 },
        ],
    },
    {
        name: 'Infr-project',
        progress: 50,
        subs: [
            { name: 'project', progress: 50 },
            { name: 'platform', progress: 60 },
            { name: 'resource', progress: 40 },
            { name: 'vault', progress: 50 },
        ],
    },
    {
        name: 'Tools',
        progress: 65,
        subs: [
            { name: 'translate', progress: 60 },
            { name: 'drawio', progress: 70 },
            { name: 'ocr', progress: 65 },
            { name: 'pdf', progress: 65 },
        ],
    },
])

</script>

<template>
    <v-container class="pa-4" fluid>
        <v-row dense>
            <v-col v-for="project in projects" :key="project.name" cols="12" sm="6" md="4">
                <v-card class="pa-4">
                    <template v-slot:title> {{ project.name }} </template>
                    <template v-slot:append>
                        <v-progress-circular :model-value="project.progress"  :size="100" :width="15"  color="primary">
                            <strong>{{ Math.ceil(project.progress) }}%</strong>
                        </v-progress-circular>
                    </template>

                    <v-card-subtitle class="mt-2">
                        Overall progress
                        <v-progress-linear striped :model-value="project.progress" color="primary" height="20" rounded>
                            <strong>{{ Math.ceil(project.progress) }}%</strong>
                        </v-progress-linear>
                    </v-card-subtitle>

                    <v-divider class="my-3"></v-divider>

                    <v-list dense>
                        <v-list-item v-for="sub in project.subs" :key="sub.name">
                            <v-list-item-title><strong>{{ sub.name }}</strong></v-list-item-title>
                            <v-progress-linear striped :model-value="sub.progress" color="secondary" height="18"
                                rounded>
                                <strong>{{ Math.ceil(sub.progress) }}%</strong>
                            </v-progress-linear>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <SearchBox></SearchBox>
</template>

<style scoped></style>
